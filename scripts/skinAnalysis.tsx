import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

// Types
export interface SkinAnalysisResult {
  primaryType: {
    type: string;
    probability: string;
  };
  allResults: {
    type: string;
    probability: string;
  }[];
  tip: string;
  imageUri?: string;
  timestamp: string;
  analysisId: string;
}

export interface AnalysisHistory {
  id: string;
  timestamp: string;
  result: SkinAnalysisResult;
  imageUri: string;
}

// Storage paths
const getAnalysisDir = (): string | null => {
  const dir = FileSystem.documentDirectory;
  return dir ? (dir.endsWith('/') ? `${dir}skin_analyses/` : `${dir}/skin_analyses/`) : null;
};

const getImagesDir = (): string | null => {
  const dir = FileSystem.documentDirectory;
  return dir ? (dir.endsWith('/') ? `${dir}skin_images/` : `${dir}/skin_images/`) : null;
};

// Initialize directories if not present
const initializeDirectories = async (): Promise<void> => {
  try {
    const aDir = getAnalysisDir();
    const iDir = getImagesDir();
    if (aDir) await FileSystem.makeDirectoryAsync(aDir, { intermediates: true });
    if (iDir) await FileSystem.makeDirectoryAsync(iDir, { intermediates: true });
  } catch {
    // Directories may already exist - ignore error
  }
};

// Save image file to app local storage
export const saveImageToStorage = async (
  imageUri: string,
  analysisId: string
): Promise<string> => {
  await initializeDirectories();
  const iDir = getImagesDir();
  if (!iDir) return imageUri;

  const fileName = `skin_analysis_${analysisId}_${Date.now()}.jpg`;
  const newPath = `${iDir}${fileName}`;

  try {
    await FileSystem.copyAsync({
      from: imageUri,
      to: newPath,
    });
    return newPath;
  } catch (error) {
    console.error('Error saving image:', error);
    return imageUri;
  }
};

// Save image to device gallery
export const saveToGallery = async (imageUri: string): Promise<boolean> => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant photo library access to save images.');
      return false;
    }
    await MediaLibrary.createAssetAsync(imageUri);
    return true;
  } catch (error) {
    console.error('Error saving to gallery:', error);
    return false;
  }
};

// Save analysis result JSON to app storage
export const saveAnalysisResult = async (
  result: Omit<SkinAnalysisResult, 'imageUri'> & { imageUri: string }
): Promise<void> => {
  await initializeDirectories();
  const aDir = getAnalysisDir();
  if (!aDir) return;

  const analysisData = {
    ...result,
    savedAt: new Date().toISOString(),
  };

  const filePath = `${aDir}analysis_${result.analysisId}.json`;

  try {
    await FileSystem.writeAsStringAsync(filePath, JSON.stringify(analysisData, null, 2));
  } catch (error) {
    console.error('Error saving analysis:', error);
  }
};

// Get all stored analysis history, sorted by recent first
export const getAnalysisHistory = async (): Promise<AnalysisHistory[]> => {
  await initializeDirectories();
  const aDir = getAnalysisDir();
  if (!aDir) return [];

  try {
    const files = await FileSystem.readDirectoryAsync(aDir);
    const analysisFiles = files.filter(file => file.startsWith('analysis_'));
    const history: AnalysisHistory[] = [];

    for (const file of analysisFiles) {
      try {
        const content = await FileSystem.readAsStringAsync(`${aDir}${file}`);
        const analysisData = JSON.parse(content);
        history.push({
          id: analysisData.analysisId,
          timestamp: analysisData.timestamp,
          result: analysisData,
          imageUri: analysisData.imageUri,
        });
      } catch (error) {
        console.error(`Error reading analysis file ${file}:`, error);
      }
    }
    return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error('Error reading analysis history:', error);
    return [];
  }
};

// Get single analysis by ID
export const getAnalysisById = async (
  analysisId: string
): Promise<AnalysisHistory | null> => {
  try {
    const aDir = getAnalysisDir();
    if (!aDir) return null;
    const filePath = `${aDir}analysis_${analysisId}.json`;
    const content = await FileSystem.readAsStringAsync(filePath);
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading analysis:', error);
    return null;
  }
};

// Delete analysis file by ID
export const deleteAnalysis = async (analysisId: string): Promise<boolean> => {
  try {
    const aDir = getAnalysisDir();
    if (!aDir) return false;
    const filePath = `${aDir}analysis_${analysisId}.json`;
    await FileSystem.deleteAsync(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting analysis:', error);
    return false;
  }
};

// Main analysis function - mock AI call, saving image and results
export const analyzeSkinImage = async (
  imageUri: string
): Promise<SkinAnalysisResult> => {
  const analysisId = `analysis_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  // Save the image for internal use
  const savedImageUri = await saveImageToStorage(imageUri, analysisId);

  // Simulate AI call delay
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Mock skin type results
  const skinTypes = ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive'];
  const probabilities = [85, 72, 45, 30, 15];

  const results = skinTypes
    .map((type, idx) => ({
      type,
      probability: `${probabilities[idx]}%`,
    }))
    .sort((a, b) => parseInt(b.probability) - parseInt(a.probability));

  const tips = {
    Oily: 'Use oil-free, non-comedogenic products and avoid heavy creams that can clog pores.',
    Dry: 'Focus on hydrating ingredients like hyaluronic acid and ceramides. Avoid harsh cleansers.',
    Combination:
      'Use different products for different areas - lighter on T-zone, richer on cheeks.',
    Normal: "Maintain your skin's balance with gentle, pH-balanced products and regular moisturizing.",
    Sensitive:
      'Avoid fragrances, alcohol, and harsh chemicals. Patch test all new products.',
  };

  const analysisResult: SkinAnalysisResult = {
    primaryType: results[0],
    allResults: results,
    tip: tips[results[0].type as keyof typeof tips] || 'Maintain a consistent skincare routine for best results.',
    imageUri: savedImageUri,
    timestamp: new Date().toISOString(),
    analysisId,
  };

  // Persist analysis
  await saveAnalysisResult({ ...analysisResult, imageUri: savedImageUri });

  return analysisResult;
};

// Optional: upload result to backend
export const uploadToBackend = async (
  analysisResult: SkinAnalysisResult
): Promise<void> => {
  try {
    // Example backend endpoint - replace with real URL and token
    const response = await fetch('YOUR_BACKEND_URL/api/skin-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer YOUR_AUTH_TOKEN',
      },
      body: JSON.stringify({
        analysisId: analysisResult.analysisId,
        skinType: analysisResult.primaryType.type,
        confidence: analysisResult.primaryType.probability,
        image: analysisResult.imageUri,
        timestamp: analysisResult.timestamp,
      }),
    });

    if (!response.ok) {
      throw new Error('Backend upload failed');
    }

    console.log('Analysis uploaded successfully');
  } catch (error) {
    console.error('Error uploading to backend:', error);
  }
};

// Export analysis JSON from storage to a file
export const exportAnalysisData = async (analysisId: string): Promise<string> => {
  try {
    const analysis = await getAnalysisById(analysisId);
    if (!analysis) throw new Error('Analysis not found');

    const exportData = {
      ...analysis,
      exportDate: new Date().toISOString(),
      appVersion: '1.0.0',
    };

    const fileName = `skin_analysis_export_${analysisId}.json`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, JSON.stringify(exportData, null, 2));
    return filePath;
  } catch (error) {
    console.error('Error exporting analysis:', error);
    throw new Error('Failed to export analysis data');
  }
};
