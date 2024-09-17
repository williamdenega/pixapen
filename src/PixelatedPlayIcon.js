import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

function PixelatedPlayIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            {/* <!-- First Column --> */}
            {/* <rect x="3" y="3" width="3" height="3" stroke="black" /> */}
            {/* <rect x="3" y="4" width="3" height="3" stroke="black" /> */}
            <rect x="5" y="0" width="3" height="3" stroke="none" />
            <rect x="5" y="3" width="3" height="3" stroke="none" />
            <rect x="5" y="6" width="3" height="3" stroke="none" />
            <rect x="5" y="9" width="3" height="3" stroke="none" />
            <rect x="5" y="12" width="3" height="3" stroke="none" />
            <rect x="5" y="15" width="3" height="3" stroke="none" />
            <rect x="5" y="18" width="3" height="3" stroke="none" />
            <rect x="5" y="21" width="3" height="3" stroke="none" />

            {/* <!-- Second Column --> */}
            {/* <rect x="4" y="4" width="3" height="3" stroke="black" /> */}
            {/* <rect x="4" y="6" width="3" height="3" stroke="black" /> */}
            <rect x="8" y="8" width="3" height="3" stroke="none" />
            <rect x="8" y="10" width="3" height="3" stroke="none" />
            <rect x="8" y="12" width="3" height="3" stroke="none" />
            <rect x="8" y="14" width="3" height="3" stroke="none" />
            <rect x="8" y="16" width="3" height="3" stroke="none" />
            <rect x="8" y="18" width="3" height="3" stroke="none" />

            {/* <!-- Third Column --> */}
            {/* <rect x="6" y="6" width="3" height="3" stroke="black" /> */}
            {/* <rect x="6" y="8" width="3" height="3" stroke="black" /> */}
            <rect x="11" y="10" width="3" height="3" stroke="none" />
            <rect x="11" y="12" width="3" height="3" stroke="none" />
            <rect x="11" y="14" width="3" height="3" stroke="none" />
            <rect x="11" y="16" width="3" height="3" stroke="none" />

            {/* <!-- Fourth Column --> */}
            {/* <rect x="8" y="8" width="3" height="3" stroke="black" /> */}
            {/* <rect x="8" y="10" width="3" height="3" stroke="black" /> */}
            <rect x="14" y="12" width="3" height="3" stroke="none" />
            <rect x="14" y="14" width="3" height="3" stroke="none" />

            {/* <!-- Fifth Column --> */}
            {/* <rect x="10" y="13" width="3" height="3" stroke="black" /> */}
            {/* <rect x="10" y="12" width="3" height="3" stroke="black" /> */}
        </SvgIcon>
    );
}

export default PixelatedPlayIcon;
