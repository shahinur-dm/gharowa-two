import { getStoreCustomerReviews } from '@/lib/serverStore';
import { instantList } from '@/lib/publicJson';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  return instantList(getStoreCustomerReviews().filter((r) => r.isActive !== false));
}
