import React from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { PlusSignIcon } from '@hugeicons/core-free-icons';
import { useThemeStore } from '../store/themeStore';

interface FloatingActionButtonProps {
    onPress: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onPress }) => {
    const { theme } = useThemeStore();
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.9,
            useNativeDriver: true,
            damping: 15,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            damping: 15,
        }).start();
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ scale: scaleAnim }],
                },
            ]}
        >
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
                style={[styles.button, { backgroundColor: theme.secondary }]}
            >
                <HugeiconsIcon icon={PlusSignIcon} size={28} color="#FFFFFF" />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 20,
        bottom: 90,
        zIndex: 1000,
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
});
