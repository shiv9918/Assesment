import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Rating,
  ImageList,
  ImageListItem,
} from '@mui/material';
import {
  ArrowBack,
  Inventory,
  LocalOffer,
  Star,
} from '@mui/icons-material';
import { useProductStore } from '@/store/productStore';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchProductById } = useProductStore();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const productData = await fetchProductById(parseInt(id));
        setProduct(productData);
        setError(null);
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, fetchProductById]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/products')} sx={{ mb: 2 }}>
          Back to Products
        </Button>
        <Alert severity="error">{error || 'Product not found'}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/products')} sx={{ mb: 3 }}>
        Back to Products
      </Button>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Card>
          <Box
            component="img"
            src={product.thumbnail}
            alt={product.title}
            sx={{
              width: '100%',
              height: 400,
              objectFit: 'cover',
            }}
          />
          {product.images.length > 1 && (
            <CardContent>
              <ImageList cols={4} gap={8}>
                {product.images.map((image: string, index: number) => (
                  <ImageListItem key={index}>
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      loading="lazy"
                      style={{ cursor: 'pointer', borderRadius: 4 }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </CardContent>
          )}
        </Card>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card>
            <CardContent>
              <Chip
                label={product.category}
                sx={{ mb: 2, textTransform: 'capitalize' }}
              />
              <Typography variant="h4" fontWeight={600} gutterBottom>
                {product.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={product.rating} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  {product.rating} rating
                </Typography>
              </Box>

              <Typography variant="body1" color="text.secondary" paragraph>
                {product.description}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="h4" color="primary.main" fontWeight={600}>
                  ${product.price}
                </Typography>
                {product.discountPercentage > 0 && (
                  <Chip
                    label={`${product.discountPercentage.toFixed(0)}% OFF`}
                    color="error"
                  />
                )}
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalOffer color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Brand
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {product.brand}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Inventory color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Stock
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {product.stock} units
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Star color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      SKU
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {product.sku}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Additional Information
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Weight:
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {product.weight}g
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Dimensions:
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {product.dimensions.width} x {product.dimensions.height} x{' '}
                    {product.dimensions.depth} cm
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Warranty:
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {product.warrantyInformation}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Shipping:
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {product.shippingInformation}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductDetail;
