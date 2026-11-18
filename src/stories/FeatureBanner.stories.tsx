import type { Meta, StoryObj } from '@storybook/react-vite';
import { FeatureBanner } from '../index';

const meta = {
  title: 'Components/Feature Banner',
  component: FeatureBanner,
  tags: ['autodocs'],
  args: {
    title: 'Share extra food',
    description: 'Offer a few portions for neighbors to pick up.',
    variant: 'share',
  },
  parameters: { docs: { description: { component: 'Use as a heading for Share or Profile. Optional motion is available on native devices when reduced motion is off.' } } },
} satisfies Meta<typeof FeatureBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Share: Story = {};
export const Impact: Story = {
  args: { variant: 'impact', title: 'Community impact', description: 'See the meals your neighborhood helped save.' },
};
