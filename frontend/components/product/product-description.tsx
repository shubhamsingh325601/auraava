import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

interface ProductDescriptionProps {
    fullDescription: string
}

export default function ProductDescription({ fullDescription }: ProductDescriptionProps) {
    return (
        <Accordion type="single" collapsible defaultValue="desc" className="border-t border-border">
            <AccordionItem value="desc">
                <AccordionTrigger className="font-serif text-base text-primary py-5">
                    Full Description
                </AccordionTrigger>
                <AccordionContent className="text-[14px] text-muted-foreground leading-relaxed">
                    {fullDescription}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="how-to-use">
                <AccordionTrigger className="font-serif text-base text-primary py-5">
                    How to Use
                </AccordionTrigger>
                <AccordionContent className="text-[14px] text-muted-foreground leading-relaxed">
                    Warm a small amount between your palms and apply evenly from mid-length to ends. For best results,
                    use 2-3 times a week and leave on for at least 30 minutes before washing, or overnight for deep
                    conditioning.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
