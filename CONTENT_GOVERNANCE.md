# Governança do conteúdo educacional

## Regra obrigatória

Toda questão nova deve nascer de um tópico de edital oficial cadastrado em `syllabus_editions` e `syllabus_topics`. Para a Polícia Federal, a matriz ativa é o Edital nº 1 – PF – Policial de 2025, atualizado pelas retificações oficiais.

Questões jurídicas só podem ser publicadas com:

- texto vigente conferido em fonte oficial;
- URL do Planalto em `content_sources` e `legal_basis`;
- data da conferência em `law_version_checked_at`;
- vínculo ao tópico do edital em `syllabus_topic_id`;
- status `active` somente depois da revisão.

Conteúdo revogado, substituído, superado ou incompatível com o edital deve ficar como `obsolete`, `revoked` ou `archived`, nunca ser apresentado como questão ativa. Súmulas e jurisprudência devem ser verificadas diretamente no tribunal competente.

O catálogo é reutilizável entre carreiras: matérias e normas podem servir a vários concursos, mas a pertinência de cada questão sempre depende do edital da carreira escolhida.
