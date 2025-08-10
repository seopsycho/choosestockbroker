import { redirect } from 'next/navigation'

export default function RootPage() {
  // Redirect to default locale and country (English/Global)
  redirect('/en/global')
}
