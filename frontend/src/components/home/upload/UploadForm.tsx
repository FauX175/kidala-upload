import React, { useEffect, useState } from 'react';
import { ClipboardCopyIcon, DocumentIcon } from '@heroicons/react/solid';
import { uploadFile } from '../../../requests/uploadRequests';
import { useDispatch, useSelector } from 'react-redux';
import {
    clearNotification,
    NotificationInfo,
    selectNotification,
    setNotification,
} from '../../../redux/slices/notificationSlice';
import { BASE_URL } from '../../../requests/routes';

function isFileImage(file: File) {
    return file && file['type'].split('/')[0] === 'image';
}

function UploadForm() {
    const dispatch = useDispatch();

    const notificationInfo: NotificationInfo = useSelector(selectNotification);

    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState('');
    const [url, setUrl] = useState('');
    const [savedToClipboard, setSavedToClipboard] = useState(false);

    const selectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) {
            return;
        }

        const electedFile = e.target.files[0];

        if (electedFile.size > 1024 * 1024) {
            return dispatch(
                setNotification({
                    type: 'error',
                    message: 'File size too large',
                })
            );
        }

        if (isFileImage(electedFile)) {
            const preview = URL.createObjectURL(electedFile);

            setFilePreview(preview);
        } else {
            setFilePreview('');
        }

        dispatch(clearNotification());
        setFile(electedFile);
        setSavedToClipboard(false);
        setUrl('');
    };

    const saveToClipboard = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();

        const kidala_url = url.replace(
            BASE_URL,
            `${window.location.href}gallery/`
        );
        navigator.clipboard.writeText(kidala_url);

        setSavedToClipboard(true);
    };

    const openUrl = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        setSavedToClipboard(false);

        const kidala_url = url.replace(BASE_URL, '/gallery/');

        window.open(kidala_url);
        dispatch(clearNotification());
    };

    return (
        <form className="w-full max-w-[400px] flex flex-col items-center justify-center px-2 sm:px-0">
            {notificationInfo.message ? (
                <p className="bg-red-600 py-1 px-4 text-white font-mono mb-4">
                    {notificationInfo.message}
                </p>
            ) : null}

            <div className="flex w-full items-center justify-center">
                <input
                    type="file"
                    onChange={(e) => selectFile(e)}
                    className="hidden"
                    name="selectFile"
                    id="selectFile"
                />

                <label
                    htmlFor="selectFile"
                    className="cursor-pointer w-32 h-10 flex items-center justify-center text-center bg-white text-black font-mono"
                >
                    {file && !url ? 'change' : 'select'} file
                </label>

                <button
                    type="submit"
                    onClick={(e) =>
                        uploadFile(e, setUrl, dispatch, setFile, file)
                    }
                    className={`bg-gray-900 text-white px-10 h-10 ml-2 flex-1 font-mono ${
                        !file ? 'opacity-75' : ''
                    }`}
                    disabled={!file}
                >
                    upload
                </button>
            </div>

            {!url && filePreview && file ? (
                <img
                    src={filePreview}
                    alt="file preview"
                    className="w-full mt-12"
                />
            ) : !url && file ? (
                <div className="flex mt-5 bg-green-700 p-2">
                    <DocumentIcon className="text-white mr-1 h-6" />

                    <p className="text-white">file is ready for upload</p>
                </div>
            ) : url ? (
                <>
                    <button
                        className="w-[250px] h-12 mt-12 text-xl bg-white font-mono "
                        onClick={openUrl}
                    >
                        open
                    </button>

                    <button
                        className="flex w-full pl-4 bg-emerald-600 items-center justify-center mt-4"
                        onClick={saveToClipboard}
                    >
                        <p className="text-white text-center truncate flex-1 my-2 font-mono">
                            {url}
                        </p>

                        <div className="h-full flex items-center justify-center w-11 border-blue-300 bg-black">
                            <ClipboardCopyIcon className="text-white h-6" />
                        </div>
                    </button>

                    {savedToClipboard ? (
                        <small className="text-emerald-500 text-center mt-2 font-mono">
                            copied to clipboard
                        </small>
                    ) : null}
                </>
            ) : null}
        </form>
    );
}

export default UploadForm;
