import React from 'react';
import MainArea from '../components/MainArea';
import Sidebar from '../components/Sidebar';

const LandingPage = () => {
    return (
        <div class="d-flex landing-page">
            {/* MainArea and Sidebar componets load in a flexbox */}
            <MainArea />
            <Sidebar />
        </div>
    );
}

export default LandingPage;
