import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, History, Copy, Check } from "lucide-react";
import { useLocalConversions, useClearLocalHistory } from "@/hooks/use-local-conversions";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface ConversionHistoryProps {
  sessionId: string;
}

export function ConversionHistory({ sessionId }: ConversionHistoryProps) {
  const { data: history, isLoading } = useLocalConversions(sessionId);
  const { mutate: clearHistory } = useClearLocalHistory();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = async (id: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast({ description: "已复制到剪贴板" });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast({ variant: "destructive", description: "复制失败" });
    }
  };

  const handleClear = () => {
    if (confirm("您确定要清空转换历史记录吗？")) {
      clearHistory(sessionId);
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full border-dashed">
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground animate-pulse">
            <History className="h-8 w-8 opacity-50" />
            <p className="text-sm">正在加载历史记录...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden bg-white/80 backdrop-blur-md shadow-sm border-border/60">
      <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b bg-muted/20">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          最近转换记录
        </CardTitle>
        {history && history.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClear}
            className="h-8 px-2 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            清空
          </Button>
        )}
      </CardHeader>
      
      <ScrollArea className="flex-1">
        <CardContent className="p-0">
          {!history || history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="bg-muted/50 p-4 rounded-full mb-4">
                <History className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-sm font-medium text-foreground">暂无记录</h3>
              <p className="text-xs text-muted-foreground max-w-[200px] mt-1">
                您的最近转换记录将自动显示在这里。
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border/40">
              <AnimatePresence initial={false}>
                {history.map((item) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="group flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-mono text-sm font-medium text-primary">¥{item.amount}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }) : '刚刚'}
                        </span>
                      </div>
                      <p className="text-lg font-chinese leading-snug text-foreground/90 break-all">
                        {item.result}
                      </p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-all"
                      onClick={() => handleCopy(item.id, item.result)}
                    >
                      {copiedId === item.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
