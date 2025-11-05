import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Share,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { 
  analyzeSkinImage, 
  saveToGallery, 
  uploadToBackend,
  exportAnalysisData,
  type SkinAnalysisResult 
} from '../../scripts/skinAnalysis';

const { width, height } = Dimensions.get('window');

const SkinAnalysisScreen = () => {
  const router = useRouter();
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SkinAnalysisResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-off" size={64} color="#7A4902" />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          We need camera access to analyze your skin type and provide personalized recommendations.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      setIsAnalyzing(true);
      try {
        // Important: capture with base64 enabled so analyzeSkinImage receives base64 string
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true, // <-- Change here: base64 must be true
          exif: true,
        });
        
        // Pass photo.base64 (not photo.uri) to analysis function
        const result = await analyzeSkinImage(photo.base64);
        setAnalysisResult(result);

        // Optional backend upload
        // await uploadToBackend(result);

      } catch (error) {
        Alert.alert('Error', 'Failed to capture or analyze image. Please try again.');
        console.error(error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const saveToDeviceGallery = async () => {
    if (!analysisResult?.imageUri) return;
    setIsSaving(true);
    try {
      const success = await saveToGallery(analysisResult.imageUri);
      if (success) {
        Alert.alert('Success', 'Image saved to your gallery!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save image to gallery.');
    } finally {
      setIsSaving(false);
    }
  };

  const shareAnalysis = async () => {
    if (!analysisResult) return;
    try {
      const exportPath = await exportAnalysisData(analysisResult.analysisId);
      await Share.share({
        title: 'My Skin Analysis - Doc & Care',
        message: `My skin type is ${analysisResult.primaryType.type} with ${analysisResult.primaryType.probability} confidence.\n\n${analysisResult.tip}`,
        url: exportPath,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share analysis.');
    }
  };

  const flipCamera = () => {
    setFacing(current => (current === 'front' ? 'back' : 'front'));
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
  };

  const viewHistory = () => {
    router.push('/history');
  };

  if (isAnalyzing) {
    return (
      <View style={styles.analyzingContainer}>
        <View style={styles.loadingAnimation}>
          <Ionicons name="camera" size={64} color="#7A4902" />
          <Text style={styles.analyzingText}>Analyzing your skin...</Text>
          <Text style={styles.analyzingSubtext}>This may take a few seconds</Text>
          <ActivityIndicator size="large" color="#7A4902" style={styles.spinner} />
        </View>
      </View>
    );
  }

  if (analysisResult) {
    return (
      <View style={styles.resultContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.resultTitle}>Skin Analysis Complete</Text>
          <View style={styles.resultCard}>
            <Text style={styles.resultType}>Your skin is</Text>
            <Text style={styles.primaryResult}>{analysisResult.primaryType.type}</Text>
            <Text style={styles.probability}>
              {analysisResult.primaryType.probability} confidence
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="bulb" size={24} color="#7A4902" />
            <Text style={styles.tipText}>{analysisResult.tip}</Text>
          </View>
          <View style={styles.allResults}>
            <Text style={styles.resultsTitle}>Detailed Analysis</Text>
            {analysisResult.allResults.map((result, index) => (
              <View key={index} style={styles.resultItem}>
                <Text style={styles.resultItemType}>{result.type}</Text>
                <Text style={styles.resultItemProbability}>{result.probability}</Text>
              </View>
            ))}
          </View>
          <View style={styles.actionSection}>
            <Text style={styles.actionSectionTitle}>Save & Share</Text>
            <View style={styles.saveShareButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={saveToDeviceGallery} disabled={isSaving}>
                {isSaving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="download" size={20} color="#FFFFFF" />
                    <Text style={styles.saveButtonText}>Save to Gallery</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton} onPress={shareAnalysis}>
                <Ionicons name="share-social" size={20} color="#7A4902" />
                <Text style={styles.shareButtonText}>Share Results</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.navigationButtons}>
            <TouchableOpacity style={styles.secondaryButton} onPress={resetAnalysis}>
              <Ionicons name="camera" size={20} color="#7A4902" />
              <Text style={styles.secondaryButtonText}>New Analysis</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.historyButton} onPress={viewHistory}>
              <Ionicons name="time" size={20} color="#7A4902" />
              <Text style={styles.historyButtonText}>View History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(tabs)/profile')}>
              <Ionicons name="sparkles" size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Get Recommendations</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
      >
        <View style={styles.cameraOverlay}>
          <View style={styles.faceOutline} />
          <Text style={styles.cameraInstruction}>
            Position your face within the frame
          </Text>
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.flipButton} onPress={flipCamera}>
              <Ionicons name="camera-reverse" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          Ensure good lighting and remove any makeup for accurate results
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  permissionContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#7A4902",
    marginTop: 20,
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    color: "#7A4902",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: "#7A4902",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  camera: { flex: 1 },
  cameraOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  faceOutline: {
    width: width * 0.7,
    height: width * 0.7,
    borderWidth: 2,
    borderColor: "#7A4902",
    borderRadius: width * 0.35,
    backgroundColor: "transparent",
  },
  cameraInstruction: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
  },
  cameraControls: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 40,
  },
  flipButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 15,
    borderRadius: 30,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
  },
  instructions: {
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  instructionsText: {
    textAlign: "center",
    color: "#7A4902",
    opacity: 0.7,
    fontSize: 14,
  },
  analyzingContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingAnimation: { alignItems: "center" },
  analyzingText: {
    fontSize: 18,
    color: "#7A4902",
    marginTop: 20,
    marginBottom: 30,
  },
  analyzingSubtext: {
    fontSize: 14,
    color: "#7A4902",
    opacity: 0.7,
    marginBottom: 20,
  },
  spinner: { marginTop: 10 },
  resultContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#7A4902",
    textAlign: "center",
    marginBottom: 30,
  },
  resultCard: {
    backgroundColor: "#DDD3BA",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  resultType: { fontSize: 16, color: "#7A4902", marginBottom: 8 },
  primaryResult: {
    fontSize: 32,
    fontWeight: "700",
    color: "#7A4902",
    marginBottom: 4,
  },
  probability: { fontSize: 16, color: "#7A4902", opacity: 0.7 },
  tipCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#DDD3BA",
    alignItems: "flex-start",
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: "#7A4902",
    marginLeft: 12,
    lineHeight: 20,
  },
  allResults: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#DDD3BA",
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#7A4902",
    marginBottom: 12,
  },
  resultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD3BA",
  },
  resultItemType: { fontSize: 16, color: "#7A4902" },
  resultItemProbability: { fontSize: 16, fontWeight: "600", color: "#7A4902" },
  actionSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#DDD3BA",
    marginBottom: 20,
  },
  actionSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7A4902",
    marginBottom: 12,
  },
  saveShareButtons: { flexDirection: "row", gap: 12 },
  saveButton: {
    flex: 1,
    backgroundColor: "#7A4902",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  shareButton: {
    flex: 1,
    backgroundColor: "#DDD3BA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  shareButtonText: {
    color: "#7A4902",
    fontSize: 14,
    fontWeight: "600",
  },
  navigationButtons: { flexDirection: "row", marginTop: 8 },
  primaryButton: {
    backgroundColor: "#7A4902",
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#DDD3BA",
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#7A4902",
    fontSize: 16,
    fontWeight: "600",
  },
  historyButton: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#DDD3BA",
  },
  historyButtonText: {
    color: "#7A4902",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default SkinAnalysisScreen;
