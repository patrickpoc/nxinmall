'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Mail, Play, Search } from 'lucide-react';

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
      return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case 'Validación':
      return 'bg-amber-50 text-amber-700 border-amber-100';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
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

  return (
    <div className="min-h-screen bg-brand-50 text-ink">
      <header className="border-b border-brand-100 bg-white/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-brand-700">Pipeline · Ejecutivo</p>
            <h1 className="text-2xl font-semibold font-display">Bolsa de leads</h1>
            <p className="text-sm text-gray-500">Busca rápido y activa onboarding desde la tabla.</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-100 text-sm font-semibold text-ink"
          >
            Volver a la landing <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <section className="bg-white rounded-2xl border border-brand-100 p-5 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {COUNTRIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleCountry(item)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    country === item
                      ? 'bg-brand-900 text-white border-brand-900'
                      : 'bg-white text-ink border-brand-100 hover:bg-brand-50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:max-w-sm">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                className="w-full rounded-full border border-brand-100 bg-white py-2 pl-10 pr-4 text-sm"
                placeholder="Buscar por empresa, nombre, email o WhatsApp"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-brand-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-brand-50 text-xs uppercase text-gray-400 tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Empresa</th>
                  <th className="px-4 py-3 text-left font-semibold">Contacto</th>
                  <th className="px-4 py-3 text-left font-semibold">País</th>
                  <th className="px-4 py-3 text-left font-semibold">Categoría</th>
                  <th className="px-4 py-3 text-left font-semibold">Estado</th>
                  <th className="px-4 py-3 text-left font-semibold">Ingreso</th>
                  <th className="px-4 py-3 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100">
                {paginatedLeads.map((lead) => {
                  const onboardingLink = `/onboarding?invite=${lead.id}`;
                  const mailto = `mailto:${lead.email}?subject=${encodeURIComponent(
                    'Tu enlace de onboarding NxinMall',
                  )}&body=${encodeURIComponent(
                    `Hola ${lead.nombre},\n\nTe comparto tu enlace único para iniciar el onboarding en NxinMall:\n${onboardingLink}\n\nSaludos,\nEquipo NxinMall`,
                  )}`;

                  return (
                    <tr key={lead.id} className="hover:bg-brand-50/60">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-ink">{lead.empresa}</p>
                        <p className="text-xs text-gray-500">{lead.nombre}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-500">{lead.email}</p>
                        <p className="text-xs text-gray-500">{lead.whatsapp}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-ink">{lead.pais}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{lead.categoria}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColor(
                            lead.estado,
                          )}`}
                        >
                          {lead.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{lead.createdAt}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={onboardingLink}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-900 text-white text-xs font-semibold"
                          >
                            Iniciar <Play className="w-3.5 h-3.5" />
                          </Link>
                          <a
                            href={mailto}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-100 text-xs font-semibold text-ink"
                          >
                            Enviar <Mail className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-gray-500">
              No hay leads con los filtros actuales.
            </div>
          )}
        </section>

        {filteredLeads.length > 0 && (
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-500">
            <p>
              Mostrando {(safePage - 1) * PAGE_SIZE + 1}-
              {Math.min(safePage * PAGE_SIZE, filteredLeads.length)} de {filteredLeads.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-full border border-brand-100 text-xs font-semibold text-ink disabled:opacity-40"
              >
                Anterior
              </button>
              <span className="text-xs text-gray-500">
                Página {safePage} de {totalPages}
              </span>
              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                className="px-3 py-1.5 rounded-full border border-brand-100 text-xs font-semibold text-ink disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
