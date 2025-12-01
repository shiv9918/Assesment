import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Button,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  ChevronLeft,
  ChevronRight,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useUserStore } from '@/store/userStore';

const Users = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const {
    users,
    total,
    loading,
    error,
    page,
    searchQuery,
    fetchUsers,
    setPage,
    setSearchQuery,
  } = useUserStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = useCallback(() => {
    setSearchQuery(localSearch);
    fetchUsers({ page: 0, search: localSearch });
  }, [localSearch, setSearchQuery, fetchUsers]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    fetchUsers({ page: newPage });
  }, [setPage, fetchUsers]);

  const totalPages = Math.ceil(total / 10);

  if (isMobile) {
    return (
      <Box>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Users
        </Typography>

        <Card sx={{ mb: 3, p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search users..."
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
            fullWidth
            onClick={handleSearch}
            sx={{ mt: 2 }}
          >
            Search
          </Button>
        </Card>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {users.map((user) => (
              <Card key={user.id}>
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={user.image} sx={{ width: 48, height: 48, mr: 2 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Phone:
                    </Typography>
                    <Typography variant="caption">{user.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Company:
                    </Typography>
                    <Typography variant="caption">{user.company.name}</Typography>
                  </Box>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate(`/users/${user.id}`)}
                    startIcon={<VisibilityIcon />}
                  >
                    View Details
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
          <Button
            variant="outlined"
            disabled={page === 0}
            onClick={() => handlePageChange(page - 1)}
            startIcon={<ChevronLeft />}
          >
            Previous
          </Button>
          <Typography variant="body2">
            Page {page + 1} of {totalPages}
          </Typography>
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
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Users
      </Typography>

      <Card sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Search users..."
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
          <Button variant="contained" onClick={handleSearch} sx={{ px: 4 }}>
            Search
          </Button>
        </Box>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={user.image} />
                        <Typography variant="body2">
                          {user.firstName} {user.lastName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{user.gender}</TableCell>
                    <TableCell>{user.company.name}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/users/${user.id}`)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
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
      </Card>
    </Box>
  );
};

export default Users;
