import Image from "next/image";
import Link from "next/link";
import { formatCalendarDayMonthYear } from "../../lib/datetime/formatCalendarDisplay";
import type { ArticleListItem } from "../../lib/sanity/queries";
import { Card } from "../ui/Card";

type ArticleGridProps = {
  locale: "en" | "bn";
  articles: ArticleListItem[];
};

export function ArticleGrid({ locale, articles }: ArticleGridProps) {
  return (
    <section className="container-shell py-16">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold uppercase">Articles</h2>
        <Link href={`/${locale}/articles`} className="text-sm font-semibold text-white/80 hover:text-white">
          View all
        </Link>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Card key={article._id}>
            <div className="relative mb-4 h-48 overflow-hidden rounded-sm">
              <Image
                src="/images/home-reference.png"
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
            <p className="mb-2 text-xs uppercase text-white/70">
              {formatCalendarDayMonthYear(article.publishedAt, locale)}
            </p>
            <h3 className="mb-3 text-xl font-bold">{article.title}</h3>
            <p className="line-clamp-3 text-sm text-white/80">{article.excerpt}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
