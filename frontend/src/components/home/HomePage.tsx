import React from 'react';
import Footer from '../navigation/Footer';
import UploadForm from './upload/UploadForm';

function HomePage() {
    return (
        <div className="w-full min-h-screen flex items-center justify-between flex-col bg-sky-900">
            <div className=""></div>

            <div className="flex flex-col items-center justify-center w-full pt-20">
                <h1 className="mb-5 text-white font-mono">kidala upload</h1>

                <UploadForm />
            </div>

            <Footer />
        </div>
    );
}

export default HomePage;
