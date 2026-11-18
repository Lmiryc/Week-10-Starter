import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { PickupCountdown } from '../index';

const minute = 60_000;

function CountdownDemo({ startsInMinutes, endsInMinutes, warningMinutes }: {
  startsInMinutes: number;
  endsInMinutes: number;
  warningMinutes?: ComponentProps<typeof PickupCountdown>['warningMinutes'];
}) {
  const now = Date.now();
  return <PickupCountdown startsAt={now + startsInMinutes * minute} endsAt={now + endsInMinutes * minute} warningMinutes={warningMinutes} />;
}

const meta = {
  title: 'Components/Pickup Countdown',
  component: CountdownDemo,
  tags: ['autodocs'],
  args: { startsInMinutes: -20, endsInMinutes: 35, warningMinutes: 15 },
  parameters: { docs: { description: { component: 'These stories use time offsets for easy previewing. In the app, pass absolute timestamps in milliseconds to PickupCountdown.' } } },
} satisfies Meta<typeof CountdownDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};
export const ClosingSoon: Story = { args: { endsInMinutes: 9 } };
export const Upcoming: Story = { args: { startsInMinutes: 15 } };
export const Ended: Story = { args: { endsInMinutes: -5 } };
