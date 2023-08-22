import { useEffect, useState } from 'preact/hooks'

export default function SiteHeader(props: any) {
  const [animateHeader, setAnimateHeader] = useState(false)

  useEffect(() => {
    const listener = () => {
      if (window.scrollY > 10) {
        setAnimateHeader(true)
      } else setAnimateHeader(false)
    }
    window.addEventListener('scroll', listener)
    return () => {
      window.removeEventListener('scroll', listener)
    }
  }, [])

  return (
    <header className={`fixed w-full top-0 border-b-2  border-gray-600/20 flex flex-row justify-center px-6 md:px-14 md:justify-between items-center py-6 ${animateHeader ? 'bg-[rgba(0,0,0,0.7)] backdrop-blur-[16px] z-10 transition ease-in-out duration-100' : ''}`}>
      {props.children}
    </header>
  )
}
