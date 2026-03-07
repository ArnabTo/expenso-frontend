import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { useThemeStore } from '../store/themeStore';
import { animations } from '../theme/animations';

export const ThemeToggler: React.FC = () => {
    const { isDark, toggleTheme, theme } = useThemeStore();
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Rotate animation when theme changes
        Animated.sequence([
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 0.8,
                    duration: animations.fast,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: animations.normal,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: animations.fast,
                useNativeDriver: true,
            }),
        ]).start(() => {
            rotateAnim.setValue(0);
        });
    }, [isDark]);

    const handlePress = () => {
        toggleTheme();
    };

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            style={[styles.container, { backgroundColor: theme.surface }]}
        >
            <Animated.View
                style={[
                    styles.iconContainer,
                    {
                        transform: [{ rotate }, { scale: scaleAnim }],
                    },
                ]}
            >
                {isDark ? (
                    <Moon color={theme.primary} size={24} fill={theme.primary} />
                ) : (
                    <Sun color={theme.primary} size={24} fill={theme.primary} />
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
