import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressRing } from '../index';

const meta = {
  title: 'Components/Progress Ring',
  component: ProgressRing,
  tags: ['autodocs'],
  args: { variant: 'recipe', value: 6, target: 8 },
  argTypes: { variant: { control: 'inline-radio', options: ['recipe', 'points'] } },
} satisfies Meta<typeof ProgressRing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RecipeMatch: Story = {};
export const PantryPoints: Story = { args: { variant: 'points', value: 320, target: 500 } };
export const TargetReached: Story = { args: { variant: 'points', value: 520, target: 500 } };
export const NoTarget: Story = { args: { target: 0 } };
