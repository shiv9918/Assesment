import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
} from '@mui/material';
import {
  People as PeopleIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { useProductStore } from '@/store/productStore';

const StatCard = ({ title, value, icon, color }: any) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography color="text.secondary" variant="body2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={600}>
            {value}
          </Typography>
        </Box>
        <Avatar
          sx={{
            bgcolor: color,
            width: 56,
            height: 56,
          }}
        >
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { total: totalUsers, fetchUsers } = useUserStore();
  const { total: totalProducts, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, [fetchUsers, fetchProducts]);

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Welcome back, {user?.firstName}!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Here's what's happening with your admin panel today.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
        <Box onClick={() => navigate('/users')} sx={{ cursor: 'pointer' }}>
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={<PeopleIcon />}
            color="primary.main"
          />
        </Box>
        <Box onClick={() => navigate('/products')} sx={{ cursor: 'pointer' }}>
          <StatCard
            title="Total Products"
            value={totalProducts}
            icon={<InventoryIcon />}
            color="success.main"
          />
        </Box>
        <StatCard
          title="Total Revenue"
          value="$45.2k"
          icon={<MoneyIcon />}
          color="warning.main"
        />
        <StatCard
          title="Growth"
          value="+12.5%"
          icon={<TrendingUpIcon />}
          color="info.main"
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3, mt: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Quick Actions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Navigate to Users or Products sections to view detailed information and manage your data.
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              System Status
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    mr: 1,
                  }}
                />
                <Typography variant="body2">API: Operational</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    mr: 1,
                  }}
                />
                <Typography variant="body2">Database: Connected</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
