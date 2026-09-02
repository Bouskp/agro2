import { FaWhatsapp } from 'react-icons/fa6'

interface WhatsAppButtonProps {
  phoneNumber?: string
  message?: string
}

export default function WhatsAppButton({
  phoneNumber = '2250714132574',
  message = "Bonjour, j'aimerais avoir plus d'informations sur Agromakers",
}: WhatsAppButtonProps) {
  const href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      aria-label='Contacter sur WhatsApp'
      className='fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 active:scale-95'
    >
      <FaWhatsapp className='h-7 w-7' />
    </a>
  )
}
