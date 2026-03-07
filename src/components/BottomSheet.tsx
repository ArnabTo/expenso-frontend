import React, { useEffect } from 'react';
import {
    View,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    PanResponder,
    TouchableWithoutFeedback,
} from 'react-native';
import { useThemeStore } from '../store/themeStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    height?: number;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
    visible,
    onClose,
    children,
    height = SCREEN_HEIGHT * 0.7,
}) => {
    const { theme } = useThemeStore();
    const translateY = React.useRef(new Animated.Value(height)).current;
    const opacity = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Slide up animation
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0,
                    damping: 25,
                    stiffness: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            // Slide down animation
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: height,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const panResponder = React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dy) > 5;
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > height * 0.3 || gestureState.vy > 0.5) {
                    onClose();
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        damping: 25,
                        stiffness: 150,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <Animated.View style={[styles.overlay, { opacity }]}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.container,
                                {
                                    height,
                                    backgroundColor: theme.surface,
                                    transform: [{ translateY }],
                                },
                            ]}
                        >
                            <View {...panResponder.panHandlers} style={styles.handleContainer}>
                                <View style={[styles.handle, { backgroundColor: theme.border }]} />
                            </View>
                            <View style={styles.content}>{children}</View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </Animated.View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    handleContainer: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
});
