'use client';

import styles from './ThemedButton.module.css';

interface ThemedButtonProps {
    title: string;
    onPress?: () => void;
    lightColor?: string;
    disabled?: boolean;
}

export default function ThemedButton({
    title,
    onPress,
    lightColor = '#4F40E2',
    disabled,
}: ThemedButtonProps) {
    return (
        <div className={styles.wrapper} style={{ borderColor: lightColor }}>
            <button
                className={styles.button}
                style={{ color: lightColor }}
                onClick={onPress}
                disabled={disabled}
            >
                {title}
            </button>
        </div>
    );
}