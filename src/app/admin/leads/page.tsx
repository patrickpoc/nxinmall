'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Mail, Play, Search, Filter, Briefcase, User, Globe2, Calendar } from 'lucide-react';
import clsx from 'clsx';

const LEADS = [
  {
    id: 'lead_pe_001',
    nombre: 'María Pérez',
    empresa: 'Agroexportadora Andina',
    email: 'maria@andina.pe',
    whatsapp: '+51 999 000 000',
    pais: 'Perú',
    categoria: 'Uvas y arándanos',
    capacidad: '120 toneladas/mes',
    estado: 'Nuevo',
    createdAt: '2026-02-12',
  },
  {
    id: 'lead_br_002',
    nombre: 'João Silva',
    empresa: 'VerdeRio Export',
    email: 'joao@verderio.br',
    whatsapp: '+55 11 98888 0000',
    pais: 'Brasil',
    categoria: 'Mango y palta',
    capacidad: '90 toneladas/mes',
    estado: 'Validación',
    createdAt: '2026-02-11',
  },
  {
    id: 'lead_co_003',
    nombre: 'Catalina Ruiz',
    empresa: 'Café Alto Norte',
    email: 'catalina@cafes.co',
    whatsapp: '+57 301 555 1212',
    pais: 'Colombia',
    categoria: 'Flores premium',
    capacidad: '45 toneladas/mes',
    estado: 'Nuevo',
    createdAt: '2026-02-10',
  },
  {
    id: 'lead_ec_004',
    nombre: 'Diego Mora',
    empresa: 'Pacific Banana Co.',
    email: 'diego@pacific.ec',
    whatsapp: '+593 98 222 2222',
    pais: 'Ecuador',
    categoria: 'Banano y piña',
    capacidad: '210 toneladas/mes',
    estado: 'Pre-aprobado',
    createdAt: '2026-02-09',
  },
];

const COUNTRIES = ['Todos', 'Perú', 'Brasil', 'Colombia', 'Ecuador'];
const PAGE_SIZE = 6;

function statusColor(status: string) {
  switch (status) {
    case 'Pre-aprobado':
      return 'bg-emerald-500 text-white border-emerald-500';
    case 'Validación':
      return 'bg-amber-500 text-white border-amber-500';
    default:
      return 'bg-brand-900 text-white border-brand-900';
  }
}

export default function LeadsPage() {
  const [country, setCountry] = useState('Todos');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filteredLeads = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return LEADS.filter((lead) => {
      const matchesCountry = country === 'Todos' || lead.pais === country;
      const matchesQuery =
        !normalized ||
        lead.empresa.toLowerCase().includes(normalized) ||
        lead.nombre.toLowerCase().includes(normalized) ||
        lead.email.toLowerCase().includes(normalized) ||
        lead.whatsapp.toLowerCase().includes(normalized);
      return matchesCountry && matchesQuery;
    });
  }, [country, query]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedLeads = filteredLeads.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleCountry = (item: string) => {
    setCountry(item);
    setPage(1);
  };

  const labelClass = "text-[10px] font-black text-brand-900/40 uppercase tracking-[0.2em] mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50/50 text-ink landing">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="transition-opacity hover:opacity-80">
              <img src="/visuals/logo.png" alt="NxinMall" className="h-8 w-auto" />
            </Link>
            <div className="hidden sm:block h-6 w-px bg-gray-100" />
            <div className="hidden sm:block">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-900/40 leading-none block mb-0.5">Pipeline Admin</span>
              <span className="text-sm font-bold text-ink">Bolsa de Leads</span>
            </div>
          </div>
          <Link
            href="/"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-50 text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-brand-900 hover:text-white transition-all duration-300 shadow-sm"
          >
            Landing <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col gap-10">
          {/* Filters Bar - Stacked Container Style */}
          <section className="bg-white rounded-[32px] border border-gray-100 p-6 sm:p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] reveal animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="flex-1">
                <p className={labelClass}>Filtrar por Mercado</p>
                <div className="flex flex-wrap gap-2.5">
                  {COUNTRIES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleCountry(item)}
                      className={clsx(
                        "px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border",
                        country === item
                          ? 'bg-brand-900 text-white border-brand-900 shadow-lg shadow-brand-900/25'
                          : 'bg-white text-gray-400 border-gray-100 hover:border-brand-500/30 hover:bg-brand-50/50'
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-full lg:max-w-md">
                <p className={labelClass}>Búsqueda Inteligente</p>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-brand-500 transition-colors" />
                  <input
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setPage(1);
                    }}
                    className="w-full rounded-2xl bg-gray-50 border-none shadow-sm py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white focus:shadow-md transition-all duration-300"
                    placeholder="Empresa, nombre, email o WhatsApp..."
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Grid of Leads */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedLeads.map((lead, index) => {
              const onboardingLink = `/onboarding?invite=${lead.id}`;
              const mailto = `mailto:${lead.email}?subject=${encodeURIComponent(
                'Tu enlace de onboarding NxinMall',
              )}&body=${encodeURIComponent(
                `Hola ${lead.nombre},\n\nTe comparto tu enlace único para iniciar el onboarding en NxinMall:\n${onboardingLink}\n\nSaludos,\nEquipo NxinMall`,
              )}`;

              return (
                <div 
                  key={lead.id} 
                  className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group reveal"
                  style={{ animationDelay: `${index * 100}ms` }}
                  data-animate="fade-up"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-900 group-hover:bg-brand-900 group-hover:text-white transition-colors duration-500">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <span className={clsx(
                      "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm",
                      statusColor(lead.estado)
                    )}>
                      {lead.estado}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-ink leading-tight mb-1 group-hover:text-brand-900 transition-colors">{lead.empresa}</h3>
                  <div className="flex items-center gap-2 text-gray-400 mb-6">
                    <Globe2 className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{lead.pais} · {lead.categoria}</span>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-ink leading-none mb-1">{lead.nombre}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{lead.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{lead.createdAt}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href={onboardingLink}
                      className="flex items-center justify-center gap-2 py-3 rounded-full bg-brand-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-900/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-brand-900/20"
                    >
                      Onboarding <Play className="w-3 h-3 fill-current" />
                    </Link>
                    <a
                      href={mailto}
                      className="flex items-center justify-center gap-2 py-3 rounded-full bg-white border border-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 hover:text-brand-900 transition-all shadow-sm"
                    >
                      Enviar <Mail className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </section>

          {filteredLeads.length === 0 && (
            <div className="bg-white rounded-[32px] border border-gray-100 py-20 text-center shadow-sm">
              <Search className="w-12 h-12 text-gray-100 mx-auto mb-4" />
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No hay leads con los filtros actuales</p>
            </div>
          )}

          {/* Pagination */}
          {filteredLeads.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Mostrando {(safePage - 1) * PAGE_SIZE + 1} - {Math.min(safePage * PAGE_SIZE, filteredLeads.length)} de {filteredLeads.length} leads
              </p>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  disabled={safePage === 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="w-10 h-10 rounded-full border border-gray-100 bg-white flex items-center justify-center text-gray-400 hover:text-brand-900 hover:border-brand-500/30 transition-all disabled:opacity-30 disabled:scale-90 shadow-sm"
                >
                  ←
                </button>
                <div className="px-4 py-2 rounded-full bg-white border border-gray-100 text-[10px] font-black text-brand-900 uppercase tracking-widest shadow-sm">
                  Pág {safePage} / {totalPages}
                </div>
                <button
                  type="button"
                  disabled={safePage === totalPages}
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  className="w-10 h-10 rounded-full border border-gray-100 bg-white flex items-center justify-center text-gray-400 hover:text-brand-900 hover:border-brand-500/30 transition-all disabled:opacity-30 disabled:scale-90 shadow-sm"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
