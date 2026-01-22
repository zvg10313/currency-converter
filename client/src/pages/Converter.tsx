import { useEffect, useState, useRef } from "react";
import { digitToChineseCurrency, validateNumber } from "@/lib/currency-converter";
import { useCreateLocalConversion } from "@/hooks/use-local-conversions";
import { ReferenceGrid } from "@/components/ReferenceGrid";
import { ConversionHistory } from "@/components/ConversionHistory";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Check, Calculator, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Converter() {
  const [sessionId, setSessionId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const { mutate: createConversion } = useCreateLocalConversion();
  const { toast } = useToast();
  
  // Debounce ref for saving history
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize Session ID
  useEffect(() => {
    let sid = localStorage.getItem("currency_converter_session");
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem("currency_converter_session", sid);
    }
    setSessionId(sid);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    // Allow digits and one decimal point
    if (!/^\d*\.?\d*$/.test(val)) return;
    
    setAmount(val);

    if (val) {
      if (validateNumber(val)) {
        const converted = digitToChineseCurrency(parseFloat(val));
        setResult(converted);

        // Debounce saving to history
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        
        saveTimeoutRef.current = setTimeout(() => {
          if (sessionId && val && converted) {
            createConversion(sessionId, val, converted);
          }
        }, 1500); // Save after 1.5s of inactivity
      } else {
        setResult("");
        // Only show toast if it looks like a complete number but invalid format (like 3 decimal places)
        if (/\.\d{3,}/.test(val)) {
          toast({
            variant: "destructive",
            title: "格式错误",
            description: "请提供有效金额，且小数点后最多保留两位（角、分）。",
          });
        }
      }
    } else {
      setResult("");
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      toast({ 
        title: "复制成功！", 
        description: "中文大写金额已复制到剪贴板。",
        duration: 2000 
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ variant: "destructive", description: "复制失败" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-50 to-red-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col items-center justify-center text-center space-y-2 py-8">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur opacity-75" />
            <div className="relative bg-background p-3 rounded-2xl shadow-sm border border-border">
              <Calculator className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-chinese">
            金融<span className="text-primary">转换器</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-[600px]">
            即时将阿拉伯数字转换为财务专用的中文大写金额。
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Converter & Grid */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Converter Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-border/60 shadow-xl shadow-primary/5 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
                <CardContent className="p-6 md:p-8 space-y-8">
                  
                  {/* Input Section */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                      <span>输入金额 (¥)</span>
                      {amount && (
                        <span className="text-xs text-primary font-mono bg-primary/10 px-2 py-0.5 rounded">
                          数字输入
                        </span>
                      )}
                    </label>
                    <div className="relative group">
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="例如: 1234.56"
                        value={amount}
                        onChange={handleInputChange}
                        className="text-3xl md:text-4xl h-auto py-6 px-4 font-mono font-light tracking-tight border-2 focus-visible:ring-0 focus-visible:border-primary transition-all rounded-xl shadow-inner bg-slate-50/50"
                        autoFocus
                      />
                      <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/20 w-8 h-8 pointer-events-none group-focus-within:text-primary/40 transition-colors" />
                    </div>
                  </div>

                  {/* Divider with Arrow */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground font-medium flex items-center gap-2">
                        转换为中文大写
                      </span>
                    </div>
                  </div>

                  {/* Result Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-muted-foreground">转换结果</label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        disabled={!result}
                        className={cn(
                          "transition-all duration-300",
                          copied ? "bg-green-50 text-green-600 border-green-200" : "hover:border-primary/50 hover:text-primary"
                        )}
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-2" /> 已复制
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" /> 复制结果
                          </>
                        )}
                      </Button>
                    </div>

                    <div className={cn(
                      "min-h-[160px] p-6 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center text-center relative overflow-hidden group",
                      result 
                        ? "bg-primary/[0.02] border-primary/20 shadow-inner" 
                        : "bg-slate-50 border-slate-200"
                    )}>
                      {result ? (
                        <div className="w-full">
                          <p className="text-2xl md:text-4xl font-chinese leading-relaxed text-primary font-medium animate-in fade-in zoom-in duration-300 break-words">
                            {result}
                          </p>
                          {/* Watermark-like decoration */}
                          <div className="absolute -bottom-6 -right-6 opacity-[0.03] pointer-events-none transform rotate-12">
                            <span className="text-[150px] font-chinese font-bold text-black">壹</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-muted-foreground/40">
                          <span className="text-4xl mb-2 font-chinese">零</span>
                          <p className="text-sm">转换结果将显示在此处</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Reference Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ReferenceGrid />
            </motion.div>
          </div>

          {/* Right Column: History */}
          <div className="lg:col-span-5 h-full min-h-[500px]">
             <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-full sticky top-8"
            >
              <ConversionHistory sessionId={sessionId} />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
