import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scale, ExternalLink, Lightbulb, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/dashboard/legislacao')({
  component: LegislacaoPage,
});

interface LegislationRow {
  id: string;
  category: string;
  law_number: string;
  law_title: string;
  summary: string;
  latest_update: string | null;
  update_source_url: string | null;
  mnemonic: string | null;
  exam_trap: string | null;
  status: string;
  replaces_law: string | null;
  display_order: number;
  verified_at: string;
}

function LegislacaoPage() {
  const [rows, setRows] = React.useState<LegislationRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [categoryFilter, setCategoryFilter] = React.useState<string>('Todas');

  React.useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('legislation_reference')
        .select('*')
        .eq('career', 'PF')
        .order('display_order', { ascending: true });
      if (!error && data) setRows(data as LegislationRow[]);
      setLoading(false);
    };
    load();
  }, []);

  const categories = React.useMemo(() => {
    const set = new Set(rows.map(r => r.category));
    return ['Todas', ...Array.from(set)];
  }, [rows]);

  const filtered = categoryFilter === 'Todas' ? rows : rows.filter(r => r.category === categoryFilter);
  const verifiedAt = rows[0]?.verified_at;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Scale className="h-6 w-6 text-secondary" /> Arsenal de Legislação
        </h1>
        <p className="text-muted-foreground">
          Só leis, súmulas e decretos vigentes — cada item conferido direto no Planalto
          {verifiedAt ? ` (última verificação: ${new Date(verifiedAt).toLocaleDateString('pt-BR')})` : ''}.
          Nada de artigo revogado ou anulado.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={cn(
              'text-xs font-bold px-3 py-1.5 rounded-full transition-colors',
              categoryFilter === c ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/70'
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-muted-foreground">Carregando legislação...</p>}
      {!loading && filtered.length === 0 && (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="pt-5 text-sm text-muted-foreground">
            Nenhuma lei cadastrada ainda para esse filtro.
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {filtered.map(row => {
          const isOpen = !!expanded[row.id];
          return (
            <Card key={row.id} className="overflow-hidden">
              <button
                className="w-full text-left"
                onClick={() => setExpanded(prev => ({ ...prev, [row.id]: !prev[row.id] }))}
              >
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm">{row.law_number}</span>
                        <Badge variant={row.status === 'vigente' ? 'default' : 'destructive'} className="text-[10px]">
                          {row.status === 'vigente' ? 'Vigente' : row.status === 'revogada' ? 'Revogada' : 'Parcial'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{row.law_title}</p>
                    </div>
                    {isOpen ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
                  </div>

                  {isOpen && (
                    <div className="mt-3 space-y-2.5 text-sm">
                      <p className="text-foreground leading-relaxed">{row.summary}</p>

                      {row.replaces_law && (
                        <p className="text-xs text-muted-foreground line-through decoration-muted-foreground/40">
                          Substitui: {row.replaces_law}
                        </p>
                      )}

                      {row.latest_update && (
                        <div className="bg-secondary/10 border-l-2 border-secondary rounded-md px-3 py-2 text-xs leading-relaxed">
                          <span className="font-bold text-secondary">Atualização: </span>
                          {row.latest_update}
                        </div>
                      )}

                      {row.mnemonic && (
                        <div className="flex items-start gap-2 bg-muted/60 rounded-md px-3 py-2 text-xs leading-relaxed">
                          <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-500" />
                          <span><span className="font-bold">Mnemônico: </span>{row.mnemonic}</span>
                        </div>
                      )}

                      {row.exam_trap && (
                        <div className="flex items-start gap-2 border-t pt-2 text-xs leading-relaxed text-muted-foreground">
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-destructive" />
                          <span><span className="font-bold text-foreground">Pegadinha comum: </span>{row.exam_trap}</span>
                        </div>
                      )}

                      {row.update_source_url && (
                        <a
                          href={row.update_source_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs text-secondary hover:underline"
                        >
                          Ver no Planalto <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
