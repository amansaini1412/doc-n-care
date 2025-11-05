import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  
  const recommendations = [
    {
      id: 1,
      name: 'Hydrating Serum',
      brand: 'La Roche-Posay',
      price: '$29.99',
      image: 'https://via.placeholder.com/80',
      tags: ['Hydrating', 'Dermatologist Verified', 'Fragrance-Free'],
      match: '95%'
    },
    {
      id: 2,
      name: 'Oil-Free Moisturizer',
      brand: 'CeraVe',
      price: '$15.99',
      image: 'https://via.placeholder.com/80',
      tags: ['Oil-Free', 'Non-Comedogenic', 'Budget-Friendly'],
      match: '92%'
    },
    {
      id: 3,
      name: 'Gentle Cleanser',
      brand: 'Cetaphil',
      price: '$12.99',
      image: 'https://via.placeholder.com/80',
      tags: ['Gentle', 'pH Balanced', 'Dermatologist Verified'],
      match: '88%'
    }
  ];

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'budget', label: 'Budget' },
    { id: 'premium', label: 'Premium' },
    { id: 'verified', label: 'Verified' },
    { id: 'organic', label: 'Organic' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* User Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>U</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>User Name</Text>
          <Text style={styles.userDetail}>Oily Skin Type • 25 years old</Text>
          <View style={styles.verificationBadge}>
            <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
            <Text style={styles.verificationText}>Verified Profile</Text>
          </View>
        </View>
      </View>

      {/* Personalized Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personalized Recommendations</Text>
        
        {/* Filter Bar */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                activeFilter === filter.id && styles.filterButtonActive
              ]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter.id && styles.filterTextActive
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recommendation Cards */}
        {recommendations.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productImage}>
              <Ionicons name="flask" size={32} color="#7A4902" />
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productBrand}>{product.brand}</Text>
              <Text style={styles.productPrice}>{product.price}</Text>
              
              <View style={styles.tagsContainer}>
                {product.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.matchContainer}>
              <Text style={styles.matchText}>{product.match}</Text>
              <Text style={styles.matchLabel}>Match</Text>
              <TouchableOpacity style={styles.buyButton}>
                <Text style={styles.buyButtonText}>Buy</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Ingredient Alerts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredient Alerts</Text>
        
        <View style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <Ionicons name="warning" size={24} color="#EF4444" />
            <Text style={styles.alertTitle}>Potential Irritants Detected</Text>
          </View>
          <Text style={styles.alertDescription}>
            Fragrance and alcohol in your recent products may cause irritation
          </Text>
          <TouchableOpacity style={styles.alertButton}>
            <Text style={styles.alertButtonText}>View Safe Alternatives</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Dermatologist Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dermatologist Verified</Text>
        
        <View style={styles.dermCard}>
          <View style={styles.dermInfo}>
            <View style={styles.dermAvatar}>
              <Text style={styles.dermAvatarText}>DR</Text>
            </View>
            <View>
              <Text style={styles.dermName}>Dr. Sarah Johnson</Text>
              <Text style={styles.dermQualification}>
                Board Certified Dermatologist
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.consultButton}>
            <Text style={styles.consultButtonText}>Consult</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Microsoft Integration */}
      <View style={styles.microsoftSection}>
        <Ionicons name="cloud" size={48} color="#0078D4" />
        <Text style={styles.microsoftTitle}>Powered by Microsoft Azure AI</Text>
        <Text style={styles.microsoftDescription}>
          Advanced skin analysis with enterprise-grade security and privacy
        </Text>
        <View style={styles.privacyLinks}>
          <Text style={styles.privacyLink}>Privacy Policy</Text>
          <Text style={styles.privacyLink}>Terms of Service</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#DDD3BA',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7A4902',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7A4902',
    marginBottom: 4,
  },
  userDetail: {
    fontSize: 14,
    color: '#7A4902',
    opacity: 0.7,
    marginBottom: 8,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7A4902',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  verificationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7A4902',
    marginBottom: 16,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#DDD3BA',
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#7A4902',
  },
  filterText: {
    color: '#7A4902',
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DDD3BA',
    shadowColor: '#7A4902',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#DDD3BA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7A4902',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: '#7A4902',
    opacity: 0.7,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7A4902',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#DDD3BA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#7A4902',
    fontWeight: '600',
  },
  matchContainer: {
    alignItems: 'center',
  },
  matchText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7A4902',
  },
  matchLabel: {
    fontSize: 12,
    color: '#7A4902',
    opacity: 0.7,
    marginBottom: 8,
  },
  buyButton: {
    backgroundColor: '#7A4902',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  alertCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 8,
  },
  alertDescription: {
    fontSize: 14,
    color: '#7A4902',
    marginBottom: 12,
    lineHeight: 20,
  },
  alertButton: {
    backgroundColor: '#7A4902',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  alertButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  dermCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDD3BA',
    justifyContent: 'space-between',
  },
  dermInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dermAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#7A4902',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dermAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dermName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7A4902',
    marginBottom: 2,
  },
  dermQualification: {
    fontSize: 12,
    color: '#7A4902',
    opacity: 0.7,
  },
  consultButton: {
    backgroundColor: '#7A4902',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  consultButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  microsoftSection: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    margin: 20,
    borderRadius: 16,
  },
  microsoftTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7A4902',
    marginTop: 12,
    marginBottom: 8,
  },
  microsoftDescription: {
    fontSize: 14,
    color: '#7A4902',
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.7,
  },
  privacyLinks: {
    flexDirection: 'row',
    gap: 20,
  },
  privacyLink: {
    color: '#7A4902',
    fontSize: 14,
  },
});

export default ProfileScreen;