import type { Meta, StoryObj } from '@storybook/react-vite';
import { PickupAreaIllustration } from '../index';

const meta = {
  title: 'Components/Pickup Area Illustration',
  component: PickupAreaIllustration,
  tags: ['autodocs'],
  args: { neighborhood: 'Kerrytown' },
  parameters: { docs: { description: { component: 'Decorative preview of a public neighborhood. The streets and circles are illustrative.' } } },
} satisfies Meta<typeof PickupAreaIllustration>;

export default meta;
export const PublicNeighborhood: StoryObj<typeof meta> = {};
