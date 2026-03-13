import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

interface CircularProgressProps {
    size: number;
    strokeWidth: number;
    percentage: number;
    color: string;
    backgroundColor: string;
    text?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    size,
    strokeWidth,
    percentage,
    color,
    backgroundColor,
    text,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = ((100 - percentage) / 100) * circumference;

    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
                {/* Background Circle */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Progress Circle */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={progress}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
                {/* Center Text */}
                {text && (
                    <SvgText
                        x={size / 2}
                        y={size / 2}
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        fontSize={size * 0.2}
                        fontWeight="bold"
                        fill={color}
                        fontFamily="Montserrat_700Bold"
                    >
                        {text}
                    </SvgText>
                )}
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
