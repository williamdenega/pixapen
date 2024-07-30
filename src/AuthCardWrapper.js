import PropTypes from 'prop-types';

// material-ui
import { Box } from '@mui/material';

// project import
import MainCard from './MainCard';

// ==============================|| AUTHENTICATION CARD WRAPPER ||============================== //

const AuthCardWrapper = ({ children, ...other }) => (
    <MainCard
        sx={{
            backgroundColor: "#66CED6",
            maxWidth: { xs: 500, lg: 1200 }, // Increased maxWidth values
            margin: { xs: 0, md: 1.5 },
            '& > *': {
                flexGrow: 1,
                flexBasis: '50%'
            }
        }}
        content={false}
        {...other}
    >
        <Box sx={{ p: { xs: 0, sm: 3, xl: 10 } }}>
            {children}
        </Box>
    </MainCard>
);

AuthCardWrapper.propTypes = {
    children: PropTypes.node
};

export default AuthCardWrapper;
