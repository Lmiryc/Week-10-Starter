import type { Meta, StoryObj } from '@storybook/react-vite';
import { AvailabilityMeter } from '../index';

const meta = {
  title: 'Components/Availability Meter',
  component: AvailabilityMeter,
  tags: ['autodocs'],
  args: { remaining: 8, capacity: 10 },
  parameters: { docs: { description: { component: 'Shows portion availability in Discover cards. Supply the current count for the listing.' } } },
} satisfies Meta<typeof AvailabilityMeter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Available: Story = {};
export const LowStock: Story = { args: { remaining: 1 } };
export const AllClaimed: Story = { args: { remaining: 0 } };
