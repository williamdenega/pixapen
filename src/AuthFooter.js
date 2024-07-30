// material-ui
import { Link, Typography, Stack, Box } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
// import CoffeeIcon from '@mui/icons-material/Coffee';
// import { IconBrandPaypalFilled } from '@tabler/icons-react';
// import InstagramIcon from '@mui/icons-material/Instagram';
// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
    <Stack direction="row" justifyContent="space-between">
        <Box display="flex" flexDirection="row" alignItems="center">
            <Typography
                variant="subtitle2"
                component={Link}
                href="https://www.buymeacoffee.com/williamdend"
                target="_blank"
                underline="hover"
            >
                Buy me a Coffee?
            </Typography>
        </Box>
        <Box>
            <Typography
                variant="subtitle2"
                component={Link}
                href="https://www.linkedin.com/in/william-denega-351954159"
                target="_blank"
                underline="hover"
            >
                <LinkedInIcon />
            </Typography>
        </Box>
    </Stack>
);

export default AuthFooter;
