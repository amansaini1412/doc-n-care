// app/(tabs)/index.tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>Hello Marta,</Text>
          <Text style={styles.subGreeting}>Lost to take care of your skin!</Text>
        </View>
        <View style={styles.profileContainer}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>M</Text>
          </View>
        </View>
      </View>

      {/* AI Camera Analysis Card */}
      <View style={styles.aiCard}>
        <LinearGradient
          colors={['#7A4902', '#936010']}
          style={styles.aiCardGradient}
        >
          <View style={styles.aiContent}>
            <View style={styles.aiTextContainer}>
              <Text style={styles.aiTitle}>
                AI-powered camera analysis identifies your unique skin characteristics instantly
              </Text>
              <TouchableOpacity style={styles.aiButton}>
                <Text style={styles.aiButtonText}>Try Now</Text>
                <Ionicons name="arrow-forward" size={16} color="#7A4902" />
              </TouchableOpacity>
            </View>
            <View style={styles.aiIconContainer}>
              <Ionicons name="camera" size={40} color="#FFFFFF" />
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Special For You Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Special for you</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <View style={styles.specialCard}>
            <View style={styles.specialImage} />
            <Text style={styles.specialTitle}>Hydrating Serum</Text>
            <Text style={styles.specialBrand}>La Roche-Posay</Text>
            <Text style={styles.specialPrice}>$29.99</Text>
          </View>
          
          <View style={styles.specialCard}>
            <View style={styles.specialImage} />
            <Text style={styles.specialTitle}>Vitamin C Cream</Text>
            <Text style={styles.specialBrand}>The Ordinary</Text>
            <Text style={styles.specialPrice}>$12.90</Text>
          </View>
          
          <View style={styles.specialCard}>
            <View style={styles.specialImage} />
            <Text style={styles.specialTitle}>Sunscreen SPF 50</Text>
            <Text style={styles.specialBrand}>Supergoop</Text>
            <Text style={styles.specialPrice}>$34.00</Text>
          </View>
        </ScrollView>
      </View>

      {/* Product Safety Check */}
      <View style={styles.safetyCard}>
        <View style={styles.safetyContent}>
          <View style={styles.safetyIcon}>
            <Ionicons name="shield-checkmark" size={24} color="#7A4902" />
          </View>
          <View style={styles.safetyTextContainer}>
            <Text style={styles.safetyTitle}>
              Check if any skincare product is safe and effective for your specific skin type
            </Text>
            <TouchableOpacity style={styles.safetyButton}>
              <Text style={styles.safetyButtonText}>Check Product</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Daily Headline */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily headline</Text>
        </View>
        
        <View style={styles.headlineCard}>
          <View style={styles.headlineImage} />
          <View style={styles.headlineContent}>
            <Text style={styles.headlineTitle}>5 changes for your skincare routine</Text>
            <Text style={styles.headlineDescription}>
              Discover the latest updates for better skin health
            </Text>
            <TouchableOpacity>
              <Text style={styles.viewMoreText}>View more</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Get Recommendations */}
      <View style={styles.recommendationCard}>
        <LinearGradient
          colors={['#7A4902', '#936010']}
          style={styles.recommendationGradient}
        >
          <View style={styles.recommendationContent}>
            <View style={styles.recommendationTextContainer}>
              <Text style={styles.recommendationTitle}>
                Get Recommendations
              </Text>
              <Text style={styles.recommendationDescription}>
                Receive personalized suggestions, ingredients analysis and product reviews
              </Text>
              <TouchableOpacity style={styles.recommendationButton}>
                <Text style={styles.recommendationButtonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.recommendationIconContainer}>
              <Ionicons name="sparkles" size={40} color="#FFFFFF" />
            </View>
          </View>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  welcomeSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: '#666666',
  },
  profileContainer: {
    marginLeft: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7A4902',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  aiCard: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#7A4902',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  aiCardGradient: {
    padding: 20,
  },
  aiContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
    lineHeight: 24,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  aiButtonText: {
    color: '#7A4902',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  aiIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#7A4902',
    fontWeight: '600',
  },
  horizontalScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  specialCard: {
    width: 150,
    marginRight: 15,
    backgroundColor: '#FFEFD8',
    borderRadius: 12,
    padding: 12,
  },
  specialImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
    marginBottom: 10,
  },
  specialTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  specialBrand: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 6,
  },
  specialPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7A4902',
  },
  safetyCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#FFEFD8',
    borderRadius: 16,
    padding: 20,
  },
  safetyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  safetyIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  safetyTextContainer: {
    flex: 1,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
    lineHeight: 22,
  },
  safetyButton: {
    backgroundColor: '#7A4902',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  safetyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  headlineCard: {
    flexDirection: 'row',
    backgroundColor: '#FFEFD8',
    borderRadius: 16,
    padding: 15,
  },
  headlineImage: {
    width: 80,
    height: 80,
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
    marginRight: 15,
  },
  headlineContent: {
    flex: 1,
  },
  headlineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
  },
  headlineDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 20,
  },
  viewMoreText: {
    fontSize: 14,
    color: '#7A4902',
    fontWeight: '600',
  },
  recommendationCard: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#7A4902',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recommendationGradient: {
    padding: 20,
  },
  recommendationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendationTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  recommendationTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 15,
    lineHeight: 20,
    opacity: 0.9,
  },
  recommendationButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  recommendationButtonText: {
    color: '#7A4902',
    fontSize: 14,
    fontWeight: '600',
  },
  recommendationIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});