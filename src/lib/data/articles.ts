// =============================================================================
// Nexus Journal — Sample Article Data
// =============================================================================

import type { CategoryId, ContentNode } from '../types';

// -----------------------------------------------------------------------------
// Articles
// -----------------------------------------------------------------------------

/**
 * Complete collection of sample articles spanning all galaxies.
 *
 * Each article contains realistic, interconnected content — not placeholder
 * text. Topics are chosen to create meaningful cross-links in the knowledge
 * graph (e.g., AI research ↔ philosophy, photography ↔ travel).
 */
export const ARTICLES: ContentNode[] = [
  // ─── 1. The Architecture of Large Language Models ───────────────────
  {
    id: 'article-llm-architecture',
    slug: 'the-architecture-of-large-language-models',
    title: 'The Architecture of Large Language Models',
    abstract:
      'A deep dive into the transformer architecture that powers modern LLMs — from self-attention to emergent capabilities.',
    content: `Large language models have fundamentally reshaped our understanding of what neural networks can achieve. At their core, these models rely on the transformer architecture introduced by Vaswani et al. in 2017, but the scale at which they operate has unlocked capabilities that were not predicted by their designers.

## Transformer Fundamentals

The transformer replaces recurrence with self-attention, allowing every token in a sequence to attend to every other token in parallel. This parallelism is what made scaling feasible — unlike LSTMs, transformers can leverage thousands of GPU cores simultaneously. The architecture consists of stacked encoder and decoder blocks, though most modern LLMs use decoder-only variants.

Each layer applies multi-head self-attention followed by a position-wise feed-forward network. Residual connections and layer normalisation stabilise training at depth. The key innovation is that the attention mechanism learns *which* parts of the input are relevant to each output position, rather than compressing the entire sequence into a fixed-size hidden state.

## Scaling Laws and Emergent Behaviour

Research from OpenAI and DeepMind has demonstrated predictable scaling laws: as you increase model parameters, dataset size, and compute budget in proportion, loss decreases as a smooth power law. But the truly surprising finding is that certain capabilities — arithmetic reasoning, code generation, chain-of-thought inference — appear abruptly at specific scale thresholds.

These emergent capabilities suggest that LLMs are doing more than pattern matching. They appear to build internal representations of syntax, semantics, and even world models. Whether these representations constitute genuine "understanding" remains one of the most debated questions in AI research today.

## Practical Implications

For engineers, the architecture decisions behind LLMs have immediate practical consequences. Choosing between dense and mixture-of-experts models, deciding on context window length, and implementing efficient inference through techniques like KV-cache, speculative decoding, and quantisation — these are the problems that define production AI systems. The architecture is no longer academic; it is infrastructure.`,
    type: 'article',
    category: 'ai-research',
    tags: ['transformers', 'LLM', 'deep-learning', 'attention', 'scaling-laws'],
    coverImage: '/images/covers/the-architecture-of-large-language-models.jpg',
    publishedAt: '2026-03-15',
    updatedAt: '2026-05-10',
    readTime: 12,
    popularity: 95,
    featured: true,
    sections: [
      { id: 'transformer-fundamentals', title: 'Transformer Fundamentals', level: 2 },
      { id: 'scaling-laws-and-emergent-behaviour', title: 'Scaling Laws and Emergent Behaviour', level: 2 },
      { id: 'practical-implications', title: 'Practical Implications', level: 2 },
    ],
  },

  // ─── 2. Building Resilient Microservices ────────────────────────────
  {
    id: 'article-resilient-microservices',
    slug: 'building-resilient-microservices',
    title: 'Building Resilient Microservices',
    abstract:
      'Patterns for designing microservice architectures that degrade gracefully under failure — circuit breakers, bulkheads, and beyond.',
    content: `Microservices promise independent deployability, team autonomy, and technology flexibility. But they also introduce a category of failures that monoliths never had to deal with: network partitions, cascading timeouts, and partial system degradation. Building resilient microservices is less about preventing failure and more about designing systems that fail well.

## The Fallacies of Distributed Computing

Every microservice architecture must confront the eight fallacies of distributed computing. The network is not reliable. Latency is not zero. Bandwidth is not infinite. These aren't theoretical concerns — they manifest as real production incidents at 3 AM. The first step toward resilience is accepting that failure is not an edge case; it's a feature of the environment.

## Circuit Breakers and Bulkheads

The circuit breaker pattern, popularised by Michael Nygard's *Release It!*, prevents a failing downstream service from dragging the entire system down. When a service detects that calls to a dependency are failing above a threshold, it "opens" the circuit and returns a fallback response immediately. After a cooldown period, it allows a few probe requests through to check if the dependency has recovered.

Bulkheads take a different approach: instead of protecting against cascading failure, they isolate failures to specific subsystems. By assigning dedicated thread pools or connection pools to each dependency, a slow database query can't starve the thread pool that handles API requests. The system degrades partially rather than catastrophically.

## Observability as a Foundation

Resilience without observability is flying blind. Distributed tracing (OpenTelemetry), structured logging, and metric dashboards aren't nice-to-haves — they're prerequisites. When a service call takes 800ms instead of 50ms, you need to know *which* hop in the chain introduced the latency. Traces give you that answer. Without them, debugging a microservice failure across ten services and three data centres is an exercise in frustration.

## The Human Element

Technical patterns only go so far. The most resilient systems I've worked on had something in common: a culture of blameless postmortems, game days where engineers intentionally break production (in controlled ways), and runbooks that are tested regularly. Technology enables resilience, but culture sustains it.`,
    type: 'article',
    category: 'software-engineering',
    tags: ['microservices', 'distributed-systems', 'resilience', 'circuit-breaker', 'observability'],
    coverImage: '/images/covers/building-resilient-microservices.jpg',
    publishedAt: '2026-02-20',
    readTime: 10,
    popularity: 82,
    featured: true,
    sections: [
      { id: 'the-fallacies-of-distributed-computing', title: 'The Fallacies of Distributed Computing', level: 2 },
      { id: 'circuit-breakers-and-bulkheads', title: 'Circuit Breakers and Bulkheads', level: 2 },
      { id: 'observability-as-a-foundation', title: 'Observability as a Foundation', level: 2 },
      { id: 'the-human-element', title: 'The Human Element', level: 2 },
    ],
  },

  // ─── 3. Golden Hour Photography ─────────────────────────────────────
  {
    id: 'article-golden-hour',
    slug: 'golden-hour-photography',
    title: 'Golden Hour Photography',
    abstract:
      'Why the hour after sunrise and before sunset produces the most magical light — and how to make the most of it.',
    content: `There's a reason photographers wake before dawn and chase the last light of day. The golden hour — roughly the first and last hour of sunlight — transforms ordinary scenes into something luminous. The light is warm, directional, and soft, casting long shadows that add depth and dimension to everything it touches.

## The Science of Warm Light

During golden hour, sunlight travels through a thicker layer of atmosphere than at midday. This longer path scatters shorter wavelengths (blue and violet) and allows the longer wavelengths (red, orange, amber) to dominate. The result is light with a colour temperature around 3,500K — warm, flattering, and rich. Shadows are filled with blue skylight, creating a natural complementary colour contrast that is almost impossible to reproduce in a studio.

## Composition in Directional Light

The low angle of golden-hour sunlight creates strong directional light that reveals texture and form. Side-lighting a portrait brings out the contours of a face. Back-lighting a landscape creates rim-lit silhouettes and lens flare. Front-lighting bathes a scene in even warmth. The same subject, photographed at noon and at golden hour, can look like two entirely different places.

The key is to arrive early and scout your compositions before the light peaks. Golden hour doesn't wait — you might have twenty truly magical minutes, and fumbling with tripod placement during that window is time you can't get back.

## Post-Processing Philosophy

I prefer to enhance golden-hour images rather than create them in post. A slight boost to warmth in the highlights, a touch of blue in the shadows, and careful attention to the histogram is usually all that's needed. The temptation to push saturation should be resisted — the best golden-hour images feel effortless, as though the light did all the work. Because, in truth, it did.`,
    type: 'article',
    category: 'photography',
    tags: ['golden-hour', 'landscape', 'lighting', 'composition', 'post-processing'],
    coverImage: '/images/covers/golden-hour-photography.jpg',
    publishedAt: '2026-01-10',
    readTime: 7,
    popularity: 74,
    featured: false,
    sections: [
      { id: 'the-science-of-warm-light', title: 'The Science of Warm Light', level: 2 },
      { id: 'composition-in-directional-light', title: 'Composition in Directional Light', level: 2 },
      { id: 'post-processing-philosophy', title: 'Post-Processing Philosophy', level: 2 },
    ],
  },

  // ─── 4. Exploring Kyoto's Hidden Temples ───────────────────────────
  {
    id: 'article-kyoto-temples',
    slug: 'exploring-kyotos-hidden-temples',
    title: "Exploring Kyoto's Hidden Temples",
    abstract:
      'Beyond Fushimi Inari and Kinkaku-ji — a guide to the quieter, more contemplative temples that most visitors miss.',
    content: `Kyoto has over 1,600 Buddhist temples, yet most visitors see the same five or six. The famous ones are famous for good reason — Fushimi Inari's vermillion torii gates are genuinely breathtaking — but the temples that moved me most were the ones I found by accident, down narrow residential streets, behind bamboo fences, with no tour buses in sight.

## Shisen-dō: The Poet's Hermitage

Tucked into the foothills of Higashiyama, Shisen-dō was built in 1641 by a samurai-turned-poet named Jōzan Ishikawa. The garden is a masterpiece of borrowed scenery — the manicured azaleas in the foreground blend seamlessly into the forested hillside behind, erasing the boundary between human design and nature. I visited in late November, when the maples were at peak colour, and had the entire garden to myself for nearly an hour.

## Hōnen-in: Moss and Silence

A ten-minute walk from the Philosopher's Path, Hōnen-in is easy to miss. The thatched entrance gate is set back from the road, framed by towering cedars. Inside, two sand mounds flanking the path are raked into seasonal patterns — water motifs in summer, maple leaves in autumn. The temple's moss garden is one of the most beautiful green spaces I've ever seen, and I say that as someone who's visited thirty countries.

## Daitoku-ji: A Compound of Zen

Daitoku-ji is technically well-known, but few visitors explore its sub-temples. Kōtō-in, with its avenue of maples and minimalist moss garden, is the standout. Zuihō-in contains a striking rock garden designed by Shigemori Mirei that incorporates a hidden cross — a nod to the temple's Christian patron during the 16th century. Each sub-temple rewards slow, careful looking.

## Practical Notes

The best time to visit these temples is weekday mornings, especially in the shoulder seasons of late March or mid-November. Bring a lens in the 35–85mm range, wear shoes that slip off easily (you'll be entering and exiting tatami rooms constantly), and leave your itinerary loose enough to sit and simply absorb.`,
    type: 'article',
    category: 'travel',
    tags: ['kyoto', 'japan', 'temples', 'zen', 'travel-guide'],
    coverImage: '/images/covers/exploring-kyotos-hidden-temples.jpg',
    publishedAt: '2025-12-05',
    readTime: 9,
    popularity: 78,
    featured: true,
    sections: [
      { id: 'shisen-do-the-poets-hermitage', title: 'Shisen-dō: The Poet\'s Hermitage', level: 2 },
      { id: 'honen-in-moss-and-silence', title: 'Hōnen-in: Moss and Silence', level: 2 },
      { id: 'daitoku-ji-a-compound-of-zen', title: 'Daitoku-ji: A Compound of Zen', level: 2 },
      { id: 'practical-notes', title: 'Practical Notes', level: 2 },
    ],
  },

  // ─── 5. On the Nature of Consciousness ─────────────────────────────
  {
    id: 'article-consciousness',
    slug: 'on-the-nature-of-consciousness',
    title: 'On the Nature of Consciousness',
    abstract:
      'What is it like to be something? Exploring the hard problem of consciousness and why it resists scientific reduction.',
    content: `David Chalmers drew a line in the sand in 1995: there are the "easy" problems of consciousness — explaining how the brain integrates information, discriminates stimuli, and controls behaviour — and then there is the "hard" problem. Why is there *something it is like* to experience the colour red, the taste of coffee, the ache of loss? Why aren't we philosophical zombies, processing information in the dark?

## The Explanatory Gap

The hard problem is not a gap in our current knowledge that future neuroscience will fill. It is a *conceptual* gap. Even if we had a complete map of every neuron, every synapse, every electrochemical cascade in a human brain, we would still face the question: why does this physical process give rise to subjective experience? The map is not the territory, and the neural correlates of consciousness are not consciousness itself.

## Integrated Information Theory

Giulio Tononi's Integrated Information Theory (IIT) offers a bold mathematical framework: consciousness is identical to a system's capacity for integrated information, quantified as Φ (phi). A system is conscious to the degree that it is both differentiated (many possible states) and integrated (the parts cannot be decomposed without losing information). IIT makes surprising predictions — it implies that a simple photodiode has a tiny flicker of experience, while a feed-forward neural network, no matter how large, has none.

## Relevance to Artificial Intelligence

The question of machine consciousness is no longer purely philosophical. As AI systems grow more capable, the question of whether they have inner experience becomes ethically urgent. If a future language model exhibits behaviour indistinguishable from human conversation, does it *experience* anything? IIT would say no — current transformer architectures lack the recurrent, integrated structure that IIT associates with consciousness. But other theories, like Global Workspace Theory, might reach different conclusions. We are navigating without a compass.

## Living with Uncertainty

Perhaps the most honest position is to hold the question open. Consciousness may be fundamental, irreducible, woven into the fabric of reality alongside mass and charge. Or it may be an emergent property of sufficiently complex information processing. What I find most remarkable is that the universe has produced beings capable of asking the question at all.`,
    type: 'article',
    category: 'philosophy',
    tags: ['consciousness', 'hard-problem', 'IIT', 'philosophy-of-mind', 'AI-ethics'],
    coverImage: '/images/covers/on-the-nature-of-consciousness.jpg',
    publishedAt: '2026-04-02',
    readTime: 11,
    popularity: 88,
    featured: true,
    sections: [
      { id: 'the-explanatory-gap', title: 'The Explanatory Gap', level: 2 },
      { id: 'integrated-information-theory', title: 'Integrated Information Theory', level: 2 },
      { id: 'relevance-to-artificial-intelligence', title: 'Relevance to Artificial Intelligence', level: 2 },
      { id: 'living-with-uncertainty', title: 'Living with Uncertainty', level: 2 },
    ],
  },

  // ─── 6. Nexus Journal: Building This Blog ──────────────────────────
  {
    id: 'project-nexus-journal',
    slug: 'nexus-journal-building-this-blog',
    title: 'Nexus Journal: Building This Blog',
    abstract:
      'A project deep-dive into the design and engineering decisions behind this very site — a knowledge graph blog.',
    content: `Every few years I rebuild my personal site. This time, I wanted to build something that reflected how I actually think: not as a chronological stream of posts, but as a web of interconnected ideas. That impulse led to Nexus Journal — a blog reimagined as an interactive knowledge graph.

## Design Philosophy

The core metaphor is a digital universe. Each article is a star. Related articles are connected by gravitational links. Categories are galaxies. The home page is a force-directed graph that you can explore, zoom, and click through. It's not the most efficient way to browse a blog, but it's the most *interesting* way — and for a personal site, I think that matters more.

## Technical Stack

Nexus Journal is built on Next.js 16 with React 19, TypeScript, and Tailwind CSS v4. The knowledge graph is rendered with react-force-graph-2d backed by d3-force. Animations use Motion (formerly Framer Motion). The entire site is statically generated at build time — there's no CMS, no database, just TypeScript files that define the content and relationships.

## The Graph Data Layer

The most interesting engineering challenge was the data layer. Each article is a ContentNode with a unique id, and relationships are defined as ContentLink objects with a strength value. At build time, these are transformed into the GraphData format that react-force-graph expects. Galaxy colours are applied to nodes, and link thickness is derived from relationship strength.

## What I Learned

Building a non-traditional blog forced me to think carefully about navigation, discoverability, and performance. A force-directed graph with 50+ nodes can be computationally expensive, so I had to implement warmup ticks, cooldown timers, and lazy rendering for off-screen nodes. The result is a site that feels alive — nodes drift gently, connections pulse, and the whole system responds to your cursor.`,
    type: 'project',
    category: 'projects',
    tags: ['next.js', 'react', 'typescript', 'knowledge-graph', 'design', 'meta'],
    coverImage: '/images/covers/nexus-journal-building-this-blog.jpg',
    publishedAt: '2026-05-20',
    readTime: 8,
    popularity: 92,
    featured: true,
    sections: [
      { id: 'design-philosophy', title: 'Design Philosophy', level: 2 },
      { id: 'technical-stack', title: 'Technical Stack', level: 2 },
      { id: 'the-graph-data-layer', title: 'The Graph Data Layer', level: 2 },
      { id: 'what-i-learned', title: 'What I Learned', level: 2 },
    ],
  },

  // ─── 7. Attention Mechanisms Explained ──────────────────────────────
  {
    id: 'tutorial-attention-mechanisms',
    slug: 'attention-mechanisms-explained',
    title: 'Attention Mechanisms Explained',
    abstract:
      'A step-by-step tutorial on how attention works in neural networks — from basic dot-product attention to multi-head self-attention.',
    content: `Attention is the single most important idea in modern deep learning. It allows a model to dynamically focus on different parts of its input when producing each part of its output. This tutorial walks through attention from first principles, building up to the multi-head self-attention mechanism used in transformers.

## Basic Dot-Product Attention

At its simplest, attention is a weighted sum. Given a query vector q and a set of key-value pairs (K, V), attention computes a compatibility score between the query and each key, normalises these scores into weights via softmax, and returns the weighted sum of values.

The formula is elegant: Attention(Q, K, V) = softmax(QKᵀ / √dₖ) V. The scaling factor √dₖ prevents the dot products from growing too large as the key dimension increases, which would push the softmax into regions with vanishingly small gradients.

## Multi-Head Attention

A single attention head can only attend to one "kind" of relationship at a time. Multi-head attention runs h parallel attention heads, each with its own learned projection matrices, and concatenates their outputs. This allows the model to simultaneously attend to different positions for different reasons — one head might track syntactic relationships while another tracks semantic similarity.

## Self-Attention vs Cross-Attention

In self-attention, the queries, keys, and values all come from the same sequence. This is what powers the encoder in a transformer: each token attends to every other token in the input. In cross-attention, the queries come from one sequence (e.g., the decoder) and the keys/values come from another (e.g., the encoder output). This is how the decoder "reads" the encoded input.

## Positional Encoding

Attention is permutation-invariant — it doesn't inherently know the order of tokens. Positional encodings inject sequence-order information, either through sinusoidal functions (the original paper) or learned embeddings. Modern models like RoPE (Rotary Position Embedding) encode relative positions directly into the attention computation, improving generalisation to longer sequences.

## Putting It All Together

A complete transformer layer applies multi-head self-attention, adds a residual connection, applies layer normalisation, passes the result through a feed-forward network, and adds another residual connection with normalisation. Stack 32, 64, or 96 of these layers, train on trillions of tokens, and you get GPT-4. The simplicity of the building block and the complexity of the emergent behaviour is what makes this architecture so remarkable.`,
    type: 'tutorial',
    category: 'ai-research',
    tags: ['attention', 'transformers', 'tutorial', 'deep-learning', 'self-attention'],
    coverImage: '/images/covers/attention-mechanisms-explained.jpg',
    publishedAt: '2026-04-18',
    readTime: 14,
    popularity: 86,
    featured: false,
    sections: [
      { id: 'basic-dot-product-attention', title: 'Basic Dot-Product Attention', level: 2 },
      { id: 'multi-head-attention', title: 'Multi-Head Attention', level: 2 },
      { id: 'self-attention-vs-cross-attention', title: 'Self-Attention vs Cross-Attention', level: 2 },
      { id: 'positional-encoding', title: 'Positional Encoding', level: 2 },
      { id: 'putting-it-all-together', title: 'Putting It All Together', level: 2 },
    ],
  },

  // ─── 8. The Future of Edge Computing ───────────────────────────────
  {
    id: 'research-edge-computing',
    slug: 'the-future-of-edge-computing',
    title: 'The Future of Edge Computing',
    abstract:
      'How moving computation to the network edge is reshaping latency-sensitive applications — from autonomous vehicles to real-time AI inference.',
    content: `The cloud solved the problem of scale, but it introduced the problem of latency. When a self-driving car needs to make a split-second decision, a 200ms round trip to a data centre is 200ms too many. Edge computing is the architectural response: move the computation closer to where the data is generated and where the decisions need to be made.

## From Cloud to Edge

The traditional cloud model centralises compute in a handful of hyperscale data centres. This works beautifully for batch processing, analytics, and applications where latency tolerance is measured in seconds. But a new generation of applications demands response times measured in milliseconds: augmented reality overlays, robotic surgery, real-time fraud detection, and on-device AI inference.

Edge computing distributes compute across a spectrum of locations — from regional data centres to cell towers to the devices themselves. The trade-off is clear: you gain latency and bandwidth efficiency but sacrifice the economies of scale and operational simplicity of centralised cloud.

## AI at the Edge

The most exciting edge computing applications involve machine learning inference. Running a neural network on a smartphone, an IoT sensor, or a factory floor robot eliminates the need to transmit raw data to the cloud, reducing latency, bandwidth costs, and privacy exposure. Techniques like model quantisation, knowledge distillation, and neural architecture search for edge-optimised models are making this feasible even on devices with limited compute budgets.

## Standards and Challenges

The edge computing ecosystem is still fragmented. ETSI's Multi-access Edge Computing (MEC) standard, Kubernetes-based edge orchestration (KubeEdge, K3s), and WebAssembly-based runtimes are all competing to become the deployment standard. Meanwhile, operational challenges — remote device management, over-the-air updates, security patching at scale — remain largely unsolved.

## Looking Ahead

I believe edge computing will become invisible infrastructure within five years. Just as we stopped thinking about "the cloud" as a distinct architectural choice and started treating it as the default, edge will become a deployment target that frameworks and platforms handle automatically. The interesting question is not whether computation moves to the edge, but how programming models evolve to make edge-native development as simple as deploying a serverless function today.`,
    type: 'research',
    category: 'software-engineering',
    tags: ['edge-computing', 'distributed-systems', 'AI-inference', 'IoT', 'latency'],
    coverImage: '/images/covers/the-future-of-edge-computing.jpg',
    publishedAt: '2026-05-05',
    readTime: 10,
    popularity: 71,
    featured: false,
    sections: [
      { id: 'from-cloud-to-edge', title: 'From Cloud to Edge', level: 2 },
      { id: 'ai-at-the-edge', title: 'AI at the Edge', level: 2 },
      { id: 'standards-and-challenges', title: 'Standards and Challenges', level: 2 },
      { id: 'looking-ahead', title: 'Looking Ahead', level: 2 },
    ],
  },

  // ─── 9. Street Photography in Tokyo ────────────────────────────────
  {
    id: 'article-street-tokyo',
    slug: 'street-photography-in-tokyo',
    title: 'Street Photography in Tokyo',
    abstract:
      'Neon reflections, rushing crowds, and quiet moments — capturing the layered rhythms of Tokyo street life.',
    content: `Tokyo is the greatest street photography city in the world. I know that's a bold claim — Paris has its charm, New York has its grit, Mumbai has its intensity — but Tokyo offers something none of them do: an inexhaustible density of visual layers. Neon and paper lanterns. Glass skyscrapers and wooden shrines. Salarymen in identical suits and Harajuku kids in outfits that defy description.

## Shibuya Crossing at Dusk

Everyone photographs Shibuya Crossing, but timing matters enormously. At midday it's chaos without beauty. But at dusk, when the neon signs begin to overpower the fading sky, and the crosswalk fills with a thousand silhouettes backlit by headlights — that's when the crossing transforms from a tourist photo into something genuinely cinematic. I shoot from the Starbucks above, with a 70-200mm lens, compressing the crowd into an abstract sea of motion.

## The Quiet Side Streets

The real Tokyo is not on the main avenues. It's in the yokochō — narrow alleyways lined with tiny bars and yakitori stalls, each seating six or eight people. Golden Gai in Shinjuku is the most famous, but Nonbei Yokochō in Shibuya and Harmonica Yokochō in Kichijōji are equally photogenic and far less crowded. The light in these alleys is warm, directional, and constantly shifting as customers open and close doors.

## Etiquette and Approach

Japanese street photography culture emphasises discretion. Pointing a large camera at someone's face is considered rude. I shoot with a compact rangefinder-style camera and a 28mm lens, held at waist level. This produces a more candid, less confrontational perspective. When someone notices me and makes eye contact, I bow slightly and move on. Respect is more important than any photograph.

## Rainy Nights

Tokyo in the rain is a different city. Every surface becomes a mirror — puddles reflect neon, wet asphalt gleams, umbrellas create repeating geometric patterns. I actively seek out rainy evenings for shooting because the visual complexity doubles when every horizontal surface becomes reflective. A polarising filter can be useful to control reflections, but I usually prefer to embrace them fully.`,
    type: 'article',
    category: 'photography',
    tags: ['street-photography', 'tokyo', 'japan', 'urban', 'neon', 'night-photography'],
    coverImage: '/images/covers/street-photography-in-tokyo.jpg',
    publishedAt: '2026-01-28',
    readTime: 8,
    popularity: 80,
    featured: false,
    sections: [
      { id: 'shibuya-crossing-at-dusk', title: 'Shibuya Crossing at Dusk', level: 2 },
      { id: 'the-quiet-side-streets', title: 'The Quiet Side Streets', level: 2 },
      { id: 'etiquette-and-approach', title: 'Etiquette and Approach', level: 2 },
      { id: 'rainy-nights', title: 'Rainy Nights', level: 2 },
    ],
  },

  // ─── 10. Stoicism in the Digital Age ───────────────────────────────
  {
    id: 'article-stoicism-digital',
    slug: 'stoicism-in-the-digital-age',
    title: 'Stoicism in the Digital Age',
    abstract:
      'Ancient Stoic principles applied to modern life — attention management, digital minimalism, and the dichotomy of control.',
    content: `Marcus Aurelius governed the Roman Empire while writing private meditations that still resonate two millennia later. Epictetus, born a slave, developed a philosophy of radical freedom rooted in the distinction between what we can control and what we cannot. The Stoics weren't building an ivory tower — they were building a practical operating system for turbulent times. And our times are nothing if not turbulent.

## The Dichotomy of Control

The foundation of Stoic practice is deceptively simple: distinguish between what is "up to us" (our judgments, intentions, desires) and what is "not up to us" (other people's opinions, market crashes, algorithms, the weather). Focus your energy exclusively on the former. This isn't passivity — it's the most radical form of agency.

Applied to digital life, the dichotomy is clarifying. You cannot control whether a tweet goes viral or gets ignored. You cannot control whether your manager reads your Slack message as sarcastic. You can control what you write, how you spend your attention, and whether you check your phone at the dinner table. Every notification is an invitation to react; Stoicism is the practice of choosing your response.

## Attention as a Moral Resource

Seneca wrote that we guard our money carefully but squander our time, which is infinitely more precious. In an attention economy, this observation gains a sharper edge. Every app on your phone is engineered by teams of brilliant designers to capture and hold your attention. The feeds are infinite. The content is free. And the cost — your irreplaceable hours — is hidden.

Stoic attention management isn't about productivity hacking. It's about alignment: spending your attention on what genuinely matters to you, rather than what happens to be algorithmically engaging. This might mean reading a book instead of scrolling, having a conversation instead of composing a reply, or simply sitting with your thoughts instead of reaching for stimulation.

## Memento Mori in the Feed

The Stoics practiced memento mori — remembering that you will die — not as morbid fixation but as a clarifying lens. When you remember that your time is finite, the infinite scroll loses its grip. The discourse of the day, which felt so urgent at 9 AM, reveals itself as noise by 9 PM. What remains is what always remains: relationships, craft, health, and the quality of your inner life.

## Practice, Not Theory

Stoicism is not a philosophy to be read about; it is a philosophy to be practised. That means daily journaling (Aurelius did it), morning premeditation of difficulties (Seneca recommended it), and evening review (Epictetus prescribed it). The digital age hasn't changed the fundamentals of the human condition — it has only amplified both the distractions and the need for inner discipline.`,
    type: 'article',
    category: 'philosophy',
    tags: ['stoicism', 'digital-minimalism', 'attention', 'marcus-aurelius', 'philosophy'],
    coverImage: '/images/covers/stoicism-in-the-digital-age.jpg',
    publishedAt: '2026-03-08',
    readTime: 9,
    popularity: 76,
    featured: false,
    sections: [
      { id: 'the-dichotomy-of-control', title: 'The Dichotomy of Control', level: 2 },
      { id: 'attention-as-a-moral-resource', title: 'Attention as a Moral Resource', level: 2 },
      { id: 'memento-mori-in-the-feed', title: 'Memento Mori in the Feed', level: 2 },
      { id: 'practice-not-theory', title: 'Practice, Not Theory', level: 2 },
    ],
  },
];

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

/**
 * Find a single article by its URL slug.
 *
 * @param slug - URL-safe slug (e.g. `"the-architecture-of-large-language-models"`)
 * @returns The matching `ContentNode`, or `undefined` if not found
 */
export function getArticle(slug: string): ContentNode | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

/**
 * Get all articles belonging to a specific galaxy (category).
 *
 * @param category - The `CategoryId` to filter by
 * @returns Array of matching `ContentNode`s, sorted by publication date (newest first)
 */
export function getArticlesByCategory(category: CategoryId): ContentNode[] {
  return ARTICLES
    .filter((a) => a.category === category)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

/**
 * Get all articles marked as `featured`.
 *
 * @returns Array of featured `ContentNode`s
 */
export function getFeaturedArticles(): ContentNode[] {
  return ARTICLES.filter((a) => a.featured);
}

/**
 * Get the most recent articles.
 *
 * @param count - Maximum number of articles to return (default: 5)
 * @returns Array of `ContentNode`s sorted by publication date (newest first)
 */
export function getRecentArticles(count: number = 5): ContentNode[] {
  return [...ARTICLES]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count);
}
