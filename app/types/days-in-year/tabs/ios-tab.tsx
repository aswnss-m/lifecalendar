"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { useModelScaler } from "@/hooks/use-model-scaler";
import { daysPassed, totalDays } from "@/lib/days-in-year";
import { Iphone } from "@/lib/sizes";

const formSchema = z.object({
    boxWidth: z.number().min(10).max(50),
    columns: z.number().min(5).max(20),
    passedColor: z.string(),
    leftColor: z.string(),
    bgColor: z.string(),
    showPercentage: z.boolean(),
    radius: z.number().min(0).max(100),
});

type FormValues = z.infer<typeof formSchema>;

export default function IosTab() {
    const passed = daysPassed();
    const total = totalDays();
    const model = Iphone["17"];
    const { x_scale, width, height } = useModelScaler(model, {
        maxHeight: 500,
    });

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            boxWidth: 25,
            columns: 10,
            passedColor: "#ef4444",
            leftColor: "#fecaca",
            bgColor: "#6b7280",
            showPercentage: false,
            radius: 0,
        },
    });

    const values = form.watch();

    // URLSearchParams — built reactively, ready for future use (sharing, export, etc.)
    const params = useMemo(() => {
        const p = new URLSearchParams();
        p.set("boxWidth", String(values.boxWidth));
        p.set("columns", String(values.columns));
        p.set("passedColor", values.passedColor.replace("#", ""));
        p.set("leftColor", values.leftColor.replace("#", ""));
        p.set("bgColor", values.bgColor.replace("#", ""));
        p.set("showPercentage", String(values.showPercentage));
        p.set("radius", String(values.radius));
        return p;
    }, [values]);

    const cellSize = x_scale(values.boxWidth);
    const borderRadius = `${values.radius}%`;

    return (
        <div className="space-y-4">
            {/* THE PREVIEW */}
            <Card style={{ width, height, backgroundColor: values.bgColor }}>
                <CardContent className="h-full content-end">
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(${values.columns}, ${cellSize}px)`,
                            gap: "4px",
                        }}
                    >
                        {Array.from({ length: total }, (_, i) => (
                            <div
                                key={"some" + i}
                                style={{
                                    width: cellSize,
                                    height: cellSize,
                                    backgroundColor:
                                        i <= passed
                                            ? values.passedColor
                                            : values.leftColor,
                                    borderRadius,
                                }}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* THE CUSTOMIZATION CONTROLS */}
            <form className="space-y-6">
                <FieldGroup>
                    {/* Box Width */}
                    <Controller
                        name="boxWidth"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Box Width — {field.value}px
                                </FieldLabel>
                                <Slider
                                    id={field.name}
                                    min={10}
                                    max={50}
                                    step={1}
                                    value={[field.value]}
                                    onValueChange={(vals) =>
                                        field.onChange(vals[0])
                                    }
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {/* Columns */}
                    <Controller
                        name="columns"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Columns — {field.value}
                                </FieldLabel>
                                <Slider
                                    id={field.name}
                                    min={5}
                                    max={20}
                                    step={5}
                                    value={[field.value]}
                                    onValueChange={(vals) =>
                                        field.onChange(vals[0])
                                    }
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {/* Days Passed Color */}
                    <Controller
                        name="passedColor"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                orientation="horizontal"
                                data-invalid={fieldState.invalid}
                            >
                                <FieldLabel htmlFor={field.name}>
                                    Days Passed Color
                                </FieldLabel>
                                <input
                                    {...field}
                                    id={field.name}
                                    type="color"
                                    className="h-8 w-14 cursor-pointer rounded border p-0.5"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {/* Days Left Color */}
                    <Controller
                        name="leftColor"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                orientation="horizontal"
                                data-invalid={fieldState.invalid}
                            >
                                <FieldLabel htmlFor={field.name}>
                                    Days Left Color
                                </FieldLabel>
                                <input
                                    {...field}
                                    id={field.name}
                                    type="color"
                                    className="h-8 w-14 cursor-pointer rounded border p-0.5"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {/* Background Color */}
                    <Controller
                        name="bgColor"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                orientation="horizontal"
                                data-invalid={fieldState.invalid}
                            >
                                <FieldLabel htmlFor={field.name}>
                                    Background Color
                                </FieldLabel>
                                <input
                                    {...field}
                                    id={field.name}
                                    type="color"
                                    className="h-8 w-14 cursor-pointer rounded border p-0.5"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {/* Show Percentage */}
                    <Controller
                        name="showPercentage"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                orientation="horizontal"
                                data-invalid={fieldState.invalid}
                            >
                                <FieldLabel htmlFor={field.name}>
                                    Show Percentage
                                </FieldLabel>
                                <Checkbox
                                    id={field.name}
                                    name={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {/* Corner Radius */}
                    <Controller
                        name="radius"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Corner Radius — {field.value}%
                                </FieldLabel>
                                <Slider
                                    id={field.name}
                                    min={0}
                                    max={100}
                                    value={[field.value]}
                                    onValueChange={(vals) =>
                                        field.onChange(vals[0])
                                    }
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>
            </form>
        </div>
    );
}
