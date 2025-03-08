// packages/ui/src/components/common/LoadingSpinner.tsx
import React from 'react';
import { getRandomInt } from "../../methods";
import '../../styles/common/loadingSpinner.css'


// Again with this component there's the question if we really need the props.
// We are going to be more careful with this one and actually give it the benefit of the doubt for now

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    message?: string;
    fullPage?: boolean;
}

const loadingMessages = [
    "What happens when you mix a rabbit with a chick?.",
    "There is only one definition of beauty... They say it's Yahir.",
    "Last time I practiced French Obama was president. So don't worry if you don't either.",
    "I am tired of writing random stuff in here."
]

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
                                                           size = 'medium',
                                                           message = 'Getting there. Hold on...',
                                                           fullPage = false
                                                       }) => {

    // Mapping sizes to pixel values; getting chosen from props
    const sizeMap = {
        small: 24,
        medium: 40,
        large: 60
    };

    const spinnerSize: number = sizeMap[size];

    const spinnerStyle = {
        width: `${spinnerSize}px`,
        height: `${spinnerSize}px`,
        // ?? What is this formula for? Getting round stuff?
        borderWidth: `${Math.max(3, spinnerSize / 10)}px`
    };

    const containerClassName = `loading-spinner-container ${fullPage ? 'full-page' : ''}`;

    return (
        <div className={containerClassName}>
            <div className="spinner" style={spinnerStyle}></div>
            {message && <p className="loading-message">{message}</p>}
            {/*
            Finally an original idea? At least I came up with it
            Load one random message from the list we created.
            */}
            <p>{loadingMessages[getRandomInt(1, 4)]}</p>
        </div>
    );
};

export default LoadingSpinner;