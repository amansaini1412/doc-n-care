// app/(tabs)/explore.tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: 'grid-outline' },
    { id: 'serums', name: 'Serums', icon: 'flask-outline' },
    { id: 'moisturizers', name: 'Moisturizers', icon: 'water-outline' },
    { id: 'cleansers', name: 'Cleansers', icon: 'bandage-outline' },
    { id: 'sunscreen', name: 'Sunscreen', icon: 'sunny-outline' },
    { id: 'masks', name: 'Masks', icon: 'sparkles-outline' },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'Hyaluronic Acid Serum',
      brand: 'The Ordinary',
      price: '$12.90',
      rating: 4.8,
      image: 'https://via.placeholder.com/150x150/FFEFD8/7A4902?text=Serum',
      isFeatured: true,
    },
    {
      id: 2,
      name: 'Vitamin C Brightening Cream',
      brand: 'La Roche-Posay',
      price: '$29.99',
      rating: 4.6,
      image: 'https://via.placeholder.com/150x150/FFEFD8/7A4902?text=Vitamin+C',
      isFeatured: true,
    },
    {
      id: 3,
      name: 'Gentle Foaming Cleanser',
      brand: 'CeraVe',
      price: '$15.99',
      rating: 4.7,
      image: 'https://via.placeholder.com/150x150/FFEFD8/7A4902?text=Cleanser',
      isFeatured: false,
    },
    {
      id: 4,
      name: 'SPF 50 Sunscreen',
      brand: 'Supergoop',
      price: '$34.00',
      rating: 4.9,
      image: 'https://via.placeholder.com/150x150/FFEFD8/7A4902?text=Sunscreen',
      isFeatured: true,
    },
  ];

  const trendingTopics = [
    {
      id: 1,
      title: 'Korean Skincare Routine',
      description: '10-step routine for glowing skin',
      image: 'https://via.placeholder.com/100x100/FFEFD8/7A4902?text=K-Beauty',
    },
    {
      id: 2,
      title: 'Anti-Aging Ingredients',
      description: 'What really works against wrinkles',
      image: 'https://via.placeholder.com/100x100/FFEFD8/7A4902?text=Anti-Age',
    },
    {
      id: 3,
      title: 'Acne Solutions',
      description: 'Products for clear skin',
      image: 'https://via.placeholder.com/100x100/FFEFD8/7A4902?text=Acne',
    },
  ];

  // Safe icon getter — avoids invalid icon names
  const getIconName = (baseName: string, isActive: boolean) => {
    if (isActive && baseName.endsWith('-outline')) {
      const filledName = baseName.replace('-outline', '');
      const validFilledIcons = [
        'grid',
        'flask',
        'water',
        'bandage',
        'sunny',
        'sparkles',
      ];
      return validFilledIcons.includes(filledName) ? filledName : baseName;
    }
    return baseName;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>Discover new products & trends</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#333333" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products, ingredients, brands..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999999"
        />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="#7A4902" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                activeCategory === category.id && styles.categoryButtonActive,
              ]}
              onPress={() => setActiveCategory(category.id)}
            >
              <View
                style={[
                  styles.categoryIcon,
                  activeCategory === category.id && styles.categoryIconActive,
                ]}
              >
                <Ionicons
                  name={getIconName(category.icon, activeCategory === category.id)}
                  size={20}
                  color={
                    activeCategory === category.id ? '#FFFFFF' : '#7A4902'
                  }
                />
              </View>
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === category.id && styles.categoryTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.featuredScroll}
        >
          {featuredProducts.map((product) => (
            <TouchableOpacity key={product.id} style={styles.featuredCard}>
              {product.isFeatured && (
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>Featured</Text>
                </View>
              )}
              <Image
                source={{ uri: product.image }}
                style={styles.featuredImage}
              />
              <View style={styles.featuredInfo}>
                <Text style={styles.featuredName}>{product.name}</Text>
                <Text style={styles.featuredBrand}>{product.brand}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{product.rating}</Text>
                </View>
                <Text style={styles.featuredPrice}>{product.price}</Text>
                <TouchableOpacity style={styles.addToCartButton}>
                  <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Trending Topics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Topics</Text>
        {trendingTopics.map((topic) => (
          <TouchableOpacity key={topic.id} style={styles.topicCard}>
            <Image source={{ uri: topic.image }} style={styles.topicImage} />
            <View style={styles.topicContent}>
              <Text style={styles.topicTitle}>{topic.title}</Text>
              <Text style={styles.topicDescription}>{topic.description}</Text>
              <TouchableOpacity style={styles.readMoreButton}>
                <Text style={styles.readMoreText}>Read More</Text>
                <Ionicons name="arrow-forward" size={14} color="#7A4902" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Brands */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Brands</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.brandsContainer}>
          {['La Roche-Posay', 'The Ordinary', 'CeraVe', 'Supergoop'].map(
            (brand, index) => (
              <TouchableOpacity key={index} style={styles.brandCard}>
                <View style={styles.brandLogo}>
                  <Text style={styles.brandInitial}>{brand.charAt(0)}</Text>
                </View>
                <Text style={styles.brandName}>{brand}</Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      {/* Special Offer */}
      <View style={styles.specialOfferCard}>
        <LinearGradient
          colors={['#7A4902', '#936010']}
          style={styles.specialOfferGradient}
        >
          <View style={styles.specialOfferContent}>
            <View style={styles.specialOfferText}>
              <Text style={styles.specialOfferTitle}>Special Offer</Text>
              <Text style={styles.specialOfferDescription}>
                Get 20% off on your first order with code: SKINCARE20
              </Text>
              <TouchableOpacity style={styles.shopNowButton}>
                <Text style={styles.shopNowText}>Shop Now</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.specialOfferIcon}>
              <Ionicons name="gift-outline" size={40} color="#FFFFFF" />
            </View>
          </View>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: { fontSize: 28, fontWeight: '700', color: '#333333', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#666666' },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFEFD8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEFD8',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: '#333333' },
  filterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: { paddingHorizontal: 20, marginBottom: 25 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#333333' },
  viewAllText: { fontSize: 14, color: '#7A4902', fontWeight: '600' },
  categoriesScroll: { marginHorizontal: -20, paddingHorizontal: 20 },
  categoryButton: { alignItems: 'center', marginRight: 20, paddingVertical: 10 },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFEFD8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIconActive: { backgroundColor: '#7A4902' },
  categoryText: { fontSize: 12, color: '#666666', fontWeight: '500' },
  categoryTextActive: { color: '#7A4902', fontWeight: '600' },
  featuredScroll: { marginHorizontal: -20, paddingHorizontal: 20 },
  featuredCard: {
    width: 200,
    backgroundColor: '#FFEFD8',
    borderRadius: 16,
    padding: 15,
    marginRight: 15,
    position: 'relative',
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#7A4902',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  featuredBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '600' },
  featuredImage: { width: '100%', height: 120, borderRadius: 8, marginBottom: 12 },
  featuredInfo: { flex: 1 },
  featuredName: { fontSize: 14, fontWeight: '600', color: '#333333', marginBottom: 4 },
  featuredBrand: { fontSize: 12, color: '#666666', marginBottom: 6 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  ratingText: { fontSize: 12, color: '#666666', marginLeft: 4 },
  featuredPrice: { fontSize: 16, fontWeight: '700', color: '#7A4902', marginBottom: 10 },
  addToCartButton: {
    backgroundColor: '#7A4902',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  topicCard: {
    flexDirection: 'row',
    backgroundColor: '#FFEFD8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  topicImage: { width: 60, height: 60, borderRadius: 8, marginRight: 15 },
  topicContent: { flex: 1 },
  topicTitle: { fontSize: 16, fontWeight: '600', color: '#333333', marginBottom: 4 },
  topicDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 18,
  },
  readMoreButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  readMoreText: { fontSize: 12, color: '#7A4902', fontWeight: '600', marginRight: 4 },
  brandsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  brandCard: {
    width: '48%',
    backgroundColor: '#FFEFD8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
  },
  brandLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#7A4902',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandInitial: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  brandName: { fontSize: 14, fontWeight: '600', color: '#333333', textAlign: 'center' },
  specialOfferCard: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#7A4902',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  specialOfferGradient: { padding: 20 },
  specialOfferContent: { flexDirection: 'row', alignItems: 'center' },
  specialOfferText: { flex: 1, marginRight: 15 },
  specialOfferTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 },
  specialOfferDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 15,
    lineHeight: 20,
    opacity: 0.9,
  },
  shopNowButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  shopNowText: { color: '#7A4902', fontSize: 14, fontWeight: '600' },
  specialOfferIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
