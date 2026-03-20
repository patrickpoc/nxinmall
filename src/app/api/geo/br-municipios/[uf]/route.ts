import { NextRequest, NextResponse } from 'next/server';

type IbgeCity = { nome?: string };

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ uf: string }> }
) {
  const { uf } = await params;
  const ufCode = String(uf || '').trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(ufCode)) {
    return NextResponse.json({ error: 'Invalid UF code' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufCode}/municipios`,
      { next: { revalidate: 60 * 60 * 24 } }
    );
    if (!res.ok) {
      return NextResponse.json({ error: 'IBGE request failed' }, { status: 502 });
    }
    const data = (await res.json()) as IbgeCity[];
    const municipalities = Array.isArray(data)
      ? data
          .map((item) => item?.nome?.trim())
          .filter((name): name is string => Boolean(name))
      : [];

    return NextResponse.json({ municipalities });
  } catch {
    return NextResponse.json({ error: 'IBGE request failed' }, { status: 502 });
  }
}
