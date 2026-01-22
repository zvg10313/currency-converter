import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const numerals = [
  { arabic: "0", chinese: "零", pinyin: "líng" },
  { arabic: "1", chinese: "壹", pinyin: "yī" },
  { arabic: "2", chinese: "贰", pinyin: "èr" },
  { arabic: "3", chinese: "叁", pinyin: "sān" },
  { arabic: "4", chinese: "肆", pinyin: "sì" },
  { arabic: "5", chinese: "伍", pinyin: "wǔ" },
  { arabic: "6", chinese: "陆", pinyin: "lù" },
  { arabic: "7", chinese: "柒", pinyin: "qī" },
  { arabic: "8", chinese: "捌", pinyin: "bā" },
  { arabic: "9", chinese: "玖", pinyin: "jiǔ" },
];

const units = [
  { arabic: "10", chinese: "拾", pinyin: "shí" },
  { arabic: "100", chinese: "佰", pinyin: "bǎi" },
  { arabic: "1K", chinese: "仟", pinyin: "qiān" },
  { arabic: "10K", chinese: "万", pinyin: "wàn" },
  { arabic: "100M", chinese: "亿", pinyin: "yì" },
];

export function ReferenceGrid() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Card className="bg-white/50 backdrop-blur-sm border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-chinese font-semibold flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-primary inline-block"></span>
          快速参考对照表
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Numerals */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">数字</h4>
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-5 sm:grid-cols-10 gap-2"
            >
              {numerals.map((num) => (
                <motion.div 
                  variants={item}
                  key={num.arabic}
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-background border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <span className="text-2xl font-chinese font-medium text-foreground">{num.chinese}</span>
                  <span className="text-[10px] font-mono text-muted-foreground mt-1">{num.arabic}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Units */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">单位</h4>
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-5 gap-2"
            >
              {units.map((u) => (
                <motion.div 
                  variants={item}
                  key={u.arabic}
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-primary/5 border border-primary/10"
                >
                  <span className="text-xl font-chinese font-medium text-primary">{u.chinese}</span>
                  <span className="text-[10px] font-mono text-primary/60 mt-1">{u.arabic}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
