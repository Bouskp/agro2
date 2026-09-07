'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import Image from 'next/image'
import logoTv from '../app/images/mianTv.png'

// Structure de la playlist (remplacer par vos vraies données/API)
const tvPlaylist = [
  {
    id: '3',
    title:
      'Créer une entreprise agricole en Afrique : ce qu’il faut vraiment savoir - Avec Daniel Oulaï',
    duration: '1:50:22',
    youtubeId: 'Dn-NMbDrsa8',
    description:
      "Dans ce troisième épisode d'AgroMakers, nous recevons Daniel OULAÏ, Fondateur et CEO de Grainotech, pour parler d’un sujet essentiel : créer une entreprise agricole en Afrique.De l’idée de départ à la structuration du projet, du choix du modèle économique aux réalités du terrain, cet échange revient sur ce qu’il faut vraiment savoir avant de se lancer dans l’entrepreneuriat agricole.",
  },
  {
    id: '2',
    title:
      'AgroMakers Ep 02 - Les réalités de la transformation locale - Axel Emmanuel, le Chocolatier Ivoirien',
    duration: '46:46',
    youtubeId: 'DaQQkt9iBRE',
    description:
      'Dans cet épisode 2 d’AgroMakers, nous recevons Axel Emmanuel, chocolatier ivoirien engagé dans la transformation locale du cacao.Dans un pays premier producteur mondial de cacao, pourquoi la valeur ajoutée reste-t-elle encore majoritairement captée à l’étranger ? Comment construire une marque made in Côte d’Ivoire ? Quels sont les défis techniques, industriels et commerciaux de la transformation locale ? AgroMakers met en lumière celles et ceux qui bâtissent l’agriculture et l’agro-industrie africaines autrement.',
  },
  {
    id: '1',
    title: 'AgroMakers Ep 1 - Fabrice Tamegnon',
    duration: '54:48',
    youtubeId: 'Io3JQnQQ54k',
    description:
      'Agro Makers est un podcast dédié à celles et ceux qui font avancer l’agriculture en Afrique.Entrepreneurs agricoles, porteurs de projets, experts et acteurs du terrain y partagent leurs parcours, leurs réalités et leurs enseignements, sans langue de bois.Dans ce premier épisode, nous ouvrons la discussion avec Fabrice Tamegnon, autour des défis concrets de l’agriculture africaine, des opportunités réelles du secteur et des leçons tirées de l’expérience du terrain.',
  },
]

type Video = (typeof tvPlaylist)[number]

export function VideoTvSection() {
  // Bug corrigé : on stocke UNE vidéo (la première), pas tout le tableau
  const [currentVideo, setCurrentVideo] = useState<Video>(tvPlaylist[0])

  return (
    <section className='w-full bg-agro-charcoal text-agro-white py-8 md:py-12'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* En-tête de section */}
        <div className='flex items-center gap-3 mb-8 md:mb-10'>
          <div className='p-2  rounded-md text-white'>
            <Image
              src={logoTv}
              alt='Logo Mian TV'
              className='h-auto w-auto rounded-md'
              width={50}
              height={50}
            />
          </div>
          <div>
            <h2 className='font-georgia text-xl md:text-3xl font-bold tracking-tight'>
              AgroMakers - Le podcast, à retrouver sur Mian TV
            </h2>
            <p className='font-arial text-white/60 text-sm mt-1 hidden md:block'>
              AgroMakers est une émission de Mian TV dédiée à l’agriculture, à
              l’agro-industrie et aux innovations qui transforment les systèmes
              alimentaires en Afrique. Elle met en lumière les entrepreneurs,
              ingénieurs, chercheurs, coopératives, investisseurs et acteurs
              publics qui façonnent une agriculture moderne, durable et
              créatrice de valeur.
            </p>
          </div>
        </div>

        {/* PLAYLIST HORIZONTALE - MOBILE UNIQUEMENT (sous le titre, au-dessus du lecteur) */}
        <div className='lg:hidden mb-5 -mx-4 sm:-mx-6'>
          <div className='flex items-center justify-between px-4 sm:px-6 mb-3'>
            <span className='font-arial text-xs font-bold uppercase tracking-wider text-white/50'>
              Vidéos de la série ({tvPlaylist.length})
            </span>
          </div>

          <div className='flex gap-3 overflow-x-auto px-4 sm:px-6 pb-2 snap-x snap-mandatory scrollbar-hide'>
            {tvPlaylist.map((video) => {
              const isPlaying = video.id === currentVideo.id

              return (
                <button
                  key={video.id}
                  onClick={() => setCurrentVideo(video)}
                  className={`snap-start shrink-0 w-[220px] text-left rounded-lg overflow-hidden border transition-all duration-200 outline-none ${
                    isPlaying
                      ? 'bg-white/10 border-agro-orange/50 shadow-md'
                      : 'bg-white/5 border-transparent hover:border-white/10'
                  }`}
                >
                  <div className='relative aspect-video w-full rounded-t-lg overflow-hidden bg-black flex-shrink-0'>
                    <Image
                      src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                      alt={video.title}
                      className='object-cover w-full h-full'
                      loading='lazy'
                      fill
                    />
                    <div
                      className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${
                        isPlaying ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <Play
                        className={`h-5 w-5 ${
                          isPlaying
                            ? 'text-agro-orange fill-agro-orange animate-pulse'
                            : 'text-white'
                        }`}
                      />
                    </div>
                    <span className='absolute bottom-1 right-1 bg-black/80 font-arial text-[10px] text-white px-1 py-0.5 rounded-sm'>
                      {video.duration}
                    </span>
                  </div>

                  <div className='p-2'>
                    <h4
                      className={`font-lora text-xs font-semibold leading-snug line-clamp-2 transition-colors ${
                        isPlaying ? 'text-agro-orange-light' : 'text-white/90'
                      }`}
                    >
                      {video.title}
                    </h4>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch'>
          {/* LECTEUR PRINCIPAL */}
          <div className='lg:col-span-7 xl:col-span-8 flex flex-col justify-between'>
            <div>
              <div className='relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-2xl border border-white/10'>
                <iframe
                  key={currentVideo.id}
                  src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=0&rel=0`}
                  title={currentVideo.title}
                  className='absolute inset-0 w-full h-full'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                />
              </div>

              <div className='mt-6'>
                <span className='font-arial text-xs font-bold text-agro-orange uppercase tracking-widest bg-agro-orange/10 px-2.5 py-1 rounded-full'>
                  {parseInt(currentVideo.id, 10) === tvPlaylist.length
                    ? 'Dernier épisode'
                    : `Épisode ${currentVideo.id}`}
                </span>
                <h3 className='font-lora text-xl sm:text-2xl font-bold mt-3 text-white leading-tight'>
                  {currentVideo.title}
                </h3>
                <p className='font-arial text-white/70 text-sm sm:text-base mt-3 leading-relaxed max-w-3xl'>
                  {currentVideo.description}
                </p>
              </div>
            </div>
          </div>

          {/* PLAYLIST VERTICALE - DESKTOP / TABLETTE UNIQUEMENT */}
          <div className='hidden lg:flex lg:col-span-5 xl:col-span-4 flex-col'>
            <span className='font-arial text-xs font-bold uppercase tracking-wider text-white/50 mb-3 px-1'>
              Vidéos de la série ({tvPlaylist.length})
            </span>

            <ScrollArea className='h-[420px] lg:h-[480px] w-full rounded-xl border border-white/10 bg-white/5 p-2'>
              <div className='flex flex-col gap-2.5'>
                {tvPlaylist.map((video) => {
                  const isPlaying = video.id === currentVideo.id

                  return (
                    <button
                      key={video.id}
                      onClick={() => setCurrentVideo(video)}
                      className={`w-full text-left rounded-lg overflow-hidden border p-2 transition-all duration-200 outline-none flex items-center gap-4 ${
                        isPlaying
                          ? 'bg-white/10 border-agro-orange/50 shadow-md'
                          : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className='relative aspect-video w-24 sm:w-28 rounded-md overflow-hidden bg-black flex-shrink-0'>
                        <Image
                          src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                          alt={video.title}
                          className='object-cover w-full h-full'
                          loading='lazy'
                          fill
                        />
                        <div
                          className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${
                            isPlaying
                              ? 'opacity-100'
                              : 'opacity-0 hover:opacity-100'
                          }`}
                        >
                          <Play
                            className={`h-5 w-5 ${
                              isPlaying
                                ? 'text-agro-orange fill-agro-orange animate-pulse'
                                : 'text-white'
                            }`}
                          />
                        </div>
                        <span className='absolute bottom-1 right-1 bg-black/80 font-arial text-[10px] text-white px-1 py-0.5 rounded-sm'>
                          {video.duration}
                        </span>
                      </div>

                      <div className='flex-1 min-w-0 pr-1'>
                        <h4
                          className={`font-lora text-sm font-semibold leading-snug line-clamp-2 transition-colors ${
                            isPlaying
                              ? 'text-agro-orange-light'
                              : 'text-white/90'
                          }`}
                        >
                          {video.title}
                        </h4>
                        <span className='font-arial text-[11px] text-white/40 mt-1 block'>
                          Durée : {video.duration}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </section>
  )
}
