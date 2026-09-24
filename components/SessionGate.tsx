import { getServerSession } from "@/lib/get-session";
import Navbar from "@/components/Navbar";

export default async function SessionGate() {
  const session = await getServerSession();
  return <Navbar session={session} />;
}