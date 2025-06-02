import Image from 'next/image';
import Link from 'next/link';
import type { BlogArticle } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CalendarDays, Clock, DollarSign, Zap } from 'lucide-react';

interface BlogCardProps {
  article: BlogArticle;
}

const BlogCard: React.FC<BlogCardProps> = ({ article }) => {
  return (
    <Link href={`/blog/${article.slug}`} className="block group h-full">
      <Card className="h-full flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg">
        <CardHeader className="p-0">
          <Image
            src={article.thumbnail}
            alt={article.title}
            width={400}
            height={250}
            className="object-cover w-full aspect-[16/10] group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={article.aiHint || 'article image'}
          />
        </CardHeader>
        <CardContent className="p-4 flex flex-col flex-grow">
          <CardTitle className="text-xl font-headline mb-2 group-hover:text-accent transition-colors line-clamp-2">
            {article.title}
          </CardTitle>
          {article.date && (
            <p className="text-xs text-muted-foreground mb-2 flex items-center">
              <CalendarDays className="h-3 w-3 mr-1.5" /> Published on {new Date(article.date).toLocaleDateString()}
            </p>
          )}
          <CardDescription className="text-sm text-muted-foreground mb-3 line-clamp-3 flex-grow">
            {article.excerpt}
          </CardDescription>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary" className="text-xs">
              <Zap className="h-3 w-3 mr-1" /> {article.difficulty}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Clock className="h-3 w-3 mr-1" /> {article.duration}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <DollarSign className="h-3 w-3 mr-1" /> {article.cost}
            </Badge>
          </div>
          <div className="mt-auto pt-2">
             <span className="text-sm font-medium text-accent group-hover:underline flex items-center">
              Read More <ArrowRight className="ml-1 h-4 w-4" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogCard;
