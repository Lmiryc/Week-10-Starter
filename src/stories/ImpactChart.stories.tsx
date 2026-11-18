import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImpactChart } from '../index';

const meta = {
  title: 'Components/Impact Chart',
  component: ImpactChart,
  tags: ['autodocs'],
  args: {
    title: 'Community impact',
    data: [
      { label: 'Mon', value: 5 }, { label: 'Tue', value: 8 }, { label: 'Wed', value: 6 },
      { label: 'Thu', value: 12 }, { label: 'Fri', value: 10 }, { label: 'Sat', value: 17 },
      { label: 'Sun', value: 14 },
    ],
  },
} satisfies Meta<typeof ImpactChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WeeklyPortions: Story = {};
export const Empty: Story = { args: { data: [] } };
