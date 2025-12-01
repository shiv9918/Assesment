import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  TextField,
  InputAdornment,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Rating,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { useProductStore } from '@/store/productStore';

const Products = () => {
  const navigate = useNavigate();
  
  const {
    products,
    categories,
    total,
    loading,
    error,
    page,
    searchQuery,
    selectedCategory,
    fetchProducts,
    fetchCategories,
    setPage,
    setSearchQuery,
    setSelectedCategory,
  } = useProductStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const handleSearch = useCallback(() => {
    setSearchQuery(localSearch);
    fetchProducts({ page: 0, search: localSearch, category: '' });
  }, [localSearch, setSearchQuery, fetchProducts]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    fetchProducts({ page: 0, category, search: '' });
    setLocalSearch('');
  }, [setSelectedCategory, fetchProducts]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    fetchProducts({ page: newPage });
  }, [setPage, fetchProducts]);

  const totalPages = Math.ceil(total / 10);

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Products
      </Typography>

      <Card sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr auto auto' }, gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Search products..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{ minWidth: 100 }}
          >
            Search
          </Button>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
          {products.map((product) => (
            <Card
              key={product.id}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
              }}
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.thumbnail}
                alt={product.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom noWrap>
                  {product.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={product.rating} precision={0.1} size="small" readOnly />
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    ({product.rating})
                  </Typography>
                </Box>
                <Chip
                  label={product.category}
                  size="small"
                  sx={{ mb: 1, textTransform: 'capitalize' }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Typography variant="h6" color="primary.main" fontWeight={600}>
                    ${product.price}
                  </Typography>
                  {product.discountPercentage > 0 && (
                    <Chip
                      label={`-${product.discountPercentage.toFixed(0)}%`}
                      color="error"
                      size="small"
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {page * 10 + 1}-{Math.min((page + 1) * 10, total)} of {total}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            disabled={page === 0}
            onClick={() => handlePageChange(page - 1)}
            startIcon={<ChevronLeft />}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            disabled={page >= totalPages - 1}
            onClick={() => handlePageChange(page + 1)}
            endIcon={<ChevronRight />}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Products;
