import * as react from 'react';

interface AvailabilityMeterProps {
    remaining: number;
    /** Total portions in the listing before reservations. */
    capacity: number;
}
declare function AvailabilityMeter({ remaining, capacity }: AvailabilityMeterProps): react.JSX.Element;

interface FeatureBannerProps {
    title: string;
    description?: string;
    variant?: 'share' | 'impact';
    /** Enables subtle decorative motion when the device permits it. */
    animated?: boolean;
}
declare function FeatureBanner({ title, description, variant, animated }: FeatureBannerProps): react.JSX.Element;

interface ImpactChartProps {
    /** Ordered periods with concise labels, such as Mon or Week 1. */
    data: ReadonlyArray<{
        label: string;
        value: number;
    }>;
    title?: string;
    unit?: string;
}
declare function ImpactChart({ data, title, unit }: ImpactChartProps): react.JSX.Element;

interface PickupAreaIllustrationProps {
    /** Public neighborhood name. Never pass an exact pickup address. */
    neighborhood: string;
}
declare function PickupAreaIllustration({ neighborhood }: PickupAreaIllustrationProps): react.JSX.Element;

interface PickupCountdownProps {
    /** Start and end of the confirmed pickup window as Unix timestamps in milliseconds. */
    startsAt: number;
    endsAt: number;
    /** Remaining time in minutes that should be highlighted. Defaults to 15. */
    warningMinutes?: number;
}
declare function PickupCountdown({ startsAt, endsAt, warningMinutes }: PickupCountdownProps): react.JSX.Element;

interface ProgressRingProps {
    variant: 'recipe' | 'points';
    value: number;
    /** The target for points or the total number of ingredients for a recipe. */
    target: number;
    label?: string;
}
declare function ProgressRing({ variant, value, target, label }: ProgressRingProps): react.JSX.Element;

declare const tokens: {
    readonly color: {
        readonly paper: "#F7F5EE";
        readonly white: "#FFFFFF";
        readonly ink: "#193329";
        readonly muted: "#52655C";
        readonly line: "#DDE6D9";
        readonly green: "#227755";
        readonly mint: "#BCE7A8";
        readonly amber: "#945517";
        readonly amberWash: "#FAE9C6";
        readonly sage: "#E8F1E2";
        readonly plum: "#5E4A80";
        readonly lavender: "#EFE7F8";
    };
    readonly radius: {
        readonly small: 10;
        readonly card: 20;
    };
};

export { AvailabilityMeter, type AvailabilityMeterProps, FeatureBanner, type FeatureBannerProps, ImpactChart, type ImpactChartProps, PickupAreaIllustration, type PickupAreaIllustrationProps, PickupCountdown, type PickupCountdownProps, ProgressRing, type ProgressRingProps, tokens };
