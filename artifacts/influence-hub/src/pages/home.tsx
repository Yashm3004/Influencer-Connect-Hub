import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Star, Shield, TrendingUp, Users, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetFeaturedTalents, useListCategories, useGetPlatformStats } from "@workspace/api-client-react";

function formatFollowers(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
  return `${count}`;
}

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
}

const categoryIcons: Record<string, string> = {
  influencer: "✦",
  youtuber: "▶",
  fashion_model: "◆",
  celebrity: "★",
  brand_ambassador: "◉",
};

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } },
  item: { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } },
};

export default function Home() {
  const { data: featuredTalents } = useGetFeaturedTalents();
  const { data: categories } = useListCategories();
  const { data: stats } = useGetPlatformStats();

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-24 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto text-center relative z-10 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="mb-6 bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 text-sm font-medium">
              The #1 Influencer Booking Platform
            </Badge>
          </motion.div>
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-none mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Book the faces that move{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              markets
            </span>
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Connect with influencers, YouTubers, fashion models, and celebrities to amplify your brand. From viral campaigns to long-term partnerships — find the right voice for your business.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/explore">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base font-bold px-8 shadow-[0_0_30px_rgba(0,229,255,0.4)] gap-2">
                Explore Talent <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/bookings">
              <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5 text-base font-medium px-8">
                View Bookings
              </Button>
            </Link>
          </motion.div>

          {stats && (
            <motion.div
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {[
                { label: "Talents Available", value: stats.totalTalents.toString() },
                { label: "Campaigns Completed", value: stats.completedCampaigns.toString() },
                { label: "Business Partners", value: stats.totalBusinesses.toString() },
                { label: "Revenue Generated", value: formatCurrency(stats.totalRevenue) },
              ].map((item) => (
                <div key={item.label} className="bg-card/40 border border-white/5 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-black text-white">{item.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="py-20 px-4 border-t border-white/5">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Browse by Category</h2>
              <p className="text-muted-foreground text-lg">Every type of creator, one powerful platform</p>
            </motion.div>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-5 gap-4"
              variants={stagger.container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {categories.map((cat) => (
                <motion.div key={cat.id} variants={stagger.item}>
                  <Link href={`/explore?category=${cat.slug}`}>
                    <div className="group cursor-pointer bg-card border border-white/5 rounded-2xl p-6 text-center hover:border-primary/30 hover:bg-primary/5 transition-all duration-300">
                      <div className="text-3xl mb-3 text-primary group-hover:scale-110 transition-transform duration-300">
                        {categoryIcons[cat.slug] ?? "◈"}
                      </div>
                      <div className="font-semibold text-white text-sm mb-1">{cat.name}</div>
                      <div className="text-xs text-muted-foreground">{cat.talentCount} creators</div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Featured Talents */}
      {featuredTalents && featuredTalents.length > 0 && (
        <section className="py-20 px-4 border-t border-white/5">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="mb-12 flex items-end justify-between"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Featured Talent</h2>
                <p className="text-muted-foreground">Top verified creators ready to grow your brand</p>
              </div>
              <Link href="/explore">
                <Button variant="ghost" className="text-primary hover:text-primary/80 gap-2">
                  View all <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              variants={stagger.container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuredTalents.slice(0, 8).map((talent) => (
                <motion.div key={talent.id} variants={stagger.item}>
                  <Link href={`/talent/${talent.id}`}>
                    <div className="group cursor-pointer bg-card border border-white/5 rounded-2xl overflow-hidden hover:border-primary/20 hover:shadow-[0_0_30px_rgba(0,229,255,0.08)] transition-all duration-300">
                      <div className="relative h-48 bg-gradient-to-br from-primary/20 via-secondary/10 to-background flex items-center justify-center">
                        {talent.profileImageUrl ? (
                          <img src={talent.profileImageUrl} alt={talent.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-black text-primary">
                            {talent.name.charAt(0)}
                          </div>
                        )}
                        {talent.verified && (
                          <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1">
                            <Shield className="w-3 h-3" />
                          </div>
                        )}
                        <div className="absolute bottom-3 left-3">
                          <Badge className="bg-black/60 text-white border-0 text-xs capitalize">
                            {talent.category.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-white group-hover:text-primary transition-colors">{talent.name}</h3>
                            <p className="text-xs text-muted-foreground">{talent.location}</p>
                          </div>
                          {talent.avgRating && (
                            <div className="flex items-center gap-1 text-xs text-yellow-400">
                              <Star className="w-3 h-3 fill-current" />
                              <span>{talent.avgRating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                          <div>
                            <div className="text-xs text-muted-foreground">Followers</div>
                            <div className="text-sm font-bold text-white">{formatFollowers(talent.followerCount)}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">From</div>
                            <div className="text-sm font-bold text-primary">${talent.ratePerPost.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">From search to campaign in minutes</h2>
            <p className="text-muted-foreground text-lg">A streamlined workflow built for busy brand teams</p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={stagger.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: <Zap className="w-6 h-6" />, step: "01", title: "Discover Talent", desc: "Browse thousands of verified influencers, YouTubers, models and celebrities filtered by category, niche, and budget." },
              { icon: <CheckCircle className="w-6 h-6" />, step: "02", title: "Send Booking Request", desc: "Submit your campaign brief directly to the talent's manager. Include goals, timelines, and your budget in one clean form." },
              { icon: <TrendingUp className="w-6 h-6" />, step: "03", title: "Launch and Grow", desc: "Collaborate via our messaging system, track campaign progress, and watch your business reach new heights." },
            ].map((item) => (
              <motion.div key={item.step} variants={stagger.item}>
                <div className="relative bg-card border border-white/5 rounded-2xl p-8">
                  <div className="absolute top-6 right-6 text-4xl font-black text-white/5">{item.step}</div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative rounded-3xl bg-gradient-to-br from-primary/10 via-card to-secondary/10 border border-white/10 p-12 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/15 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/15 rounded-full blur-[80px]" />
              </div>
              <Users className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                Ready to take your business to the next level?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Join hundreds of businesses already growing with InfluenceHub. Your audience is waiting.
              </p>
              <Link href="/explore">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base px-10 shadow-[0_0_40px_rgba(0,229,255,0.4)] gap-2">
                  Start Booking <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
