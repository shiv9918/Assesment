import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  ArrowBack,
  Email,
  Phone,
  Cake,
  LocationOn,
  Work,
  School,
} from '@mui/icons-material';
import { useUserStore } from '@/store/userStore';

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchUserById } = useUserStore();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const userData = await fetchUserById(parseInt(id));
        setUser(userData);
        setError(null);
      } catch (err) {
        setError('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id, fetchUserById]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/users')} sx={{ mb: 2 }}>
          Back to Users
        </Button>
        <Alert severity="error">{error || 'User not found'}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/users')} sx={{ mb: 3 }}>
        Back to Users
      </Button>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 3 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Avatar
              src={user.image}
              sx={{ width: 120, height: 120, margin: '0 auto', mb: 2 }}
            />
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
            <Chip
              label={user.gender}
              color="primary"
              size="small"
              sx={{ mt: 1, textTransform: 'capitalize' }}
            />
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Contact Information
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body2">{user.email}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body2">{user.phone}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Cake color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Birth Date
                    </Typography>
                    <Typography variant="body2">{user.birthDate}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Address
                    </Typography>
                    <Typography variant="body2">
                      {user.address.city}, {user.address.state}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Professional Information
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Work color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Company
                    </Typography>
                    <Typography variant="body2">{user.company.name}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <School color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Job Title
                    </Typography>
                    <Typography variant="body2">{user.company.title}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, gridColumn: '1 / -1' }}>
                  <LocationOn color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Company Address
                    </Typography>
                    <Typography variant="body2">{user.company.address.address}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.company.address.city}, {user.company.address.state}{' '}
                      {user.company.address.postalCode}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default UserDetail;
