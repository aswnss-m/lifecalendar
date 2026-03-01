"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import { Checkbox } from "@/components/ui/checkbox";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { useModelScaler } from "@/hooks/use-model-scaler";
import { Iphone } from "@/lib/sizes";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
    boxWidth: z.number().min(10).max(50),
    columns: z.number().min(5).max(20),
    passedColor: z.string(),
    leftColor: z.string(),
    bgColor: z.string(),
    showPercentage: z.boolean(),
    daysLeftColor: z.string(),
    percentColor: z.string(),
    radius: z.number().min(0).max(100),
});

export type FormValues = z.infer<typeof formSchema>;

export const defaultValues: FormValues = {
    boxWidth: 25,
    columns: 10,
    passedColor: "#ef4444",
    leftColor: "#fecaca",
    bgColor: "#6b7280",
    showPercentage: true,
    daysLeftColor: "#ffffff",
    percentColor: "#ffffff",
    radius: 0,
};

interface Props {
    onValuesChange: (values: FormValues) => void;
}

export default function IosCustomization({ onValuesChange }: Props) {
    const { x_scale, width } = useModelScaler(Iphone[ "17" ], {
        maxHeight: 500,
    });

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const values = form.watch();
    const { setError, clearErrors } = form;

    // Overflow check — purely mathematical, no DOM ref needed.
    // containerWidth = card width minus CardContent's px-6 padding (24px × 2).
    const cellSize = x_scale(values.boxWidth);
    const containerWidth = width - 48;
    const GAP = 4;

    const checkOverflow = useCallback(() => {
        const naturalGridWidth =
            values.columns * cellSize + (values.columns - 1) * GAP;
        if (naturalGridWidth > containerWidth) {
            setError("columns", {
                type: "overflow",
                message: "Grid overflows the preview — reduce columns or box width",
            });
            setError("boxWidth", {
                type: "overflow",
                message: "Grid overflows the preview — reduce columns or box width",
            });
        } else {
            clearErrors([ "columns", "boxWidth" ]);
        }
    }, [ setError, clearErrors, values.columns, cellSize, containerWidth ]);

    useEffect(() => {
        checkOverflow();
    }, [ checkOverflow ]);

    // Notify parent via subscription — runs once, stays active for component lifetime.
    useEffect(() => {
        onValuesChange(form.getValues());
        const { unsubscribe } = form.watch((vals) => {
            onValuesChange(vals as FormValues);
        });
        return unsubscribe;
    }, [ form, onValuesChange ]);

    return (
        <form className="space-y-6 pt-4 max-w-lg w-full flex flex-col">

            <FieldSet>
                <FieldLegend>
                    Grid
                </FieldLegend>

                <FieldDescription>
                    Set the size and shape of each day cell
                </FieldDescription>
                <FieldGroup className={'space-y-2'}>
                    {/* Box Width */}
                    <Controller
                        name="boxWidth"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name} className={'flex justify-between'}>
                                    <span>Width</span>
                                    <span className={'text-muted-foreground'}>{field.value}px</span>
                                </FieldLabel>
                                <Slider
                                    id={field.name}
                                    min={10}
                                    max={50}
                                    step={1}
                                    value={[ field.value ]}
                                    onValueChange={(vals) =>
                                        field.onChange(vals[ 0 ])
                                    }
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[ fieldState.error ]} />
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
                                <FieldLabel htmlFor={field.name} className={'flex justify-between'}>
                                    <span>Columns</span>
                                    <span className={'text-muted-foreground'}>{field.value}</span>
                                </FieldLabel>
                                <Slider
                                    id={field.name}
                                    min={5}
                                    max={20}
                                    step={5}
                                    value={[ field.value ]}
                                    onValueChange={(vals) =>
                                        field.onChange(vals[ 0 ])
                                    }
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[ fieldState.error ]} />
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
                                <FieldLabel htmlFor={field.name} className={'flex justify-between'}>
                                    <span>Corner Radius</span>
                                    <span className={'text-muted-foreground'}>{field.value}%</span>
                                </FieldLabel>
                                <Slider
                                    id={field.name}
                                    min={0}
                                    max={100}
                                    value={[ field.value ]}
                                    onValueChange={(vals) =>
                                        field.onChange(vals[ 0 ])
                                    }
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[ fieldState.error ]} />
                                )}
                            </Field>
                        )}
                    />

                </FieldGroup>
            </FieldSet>
            <FieldSet>
                <FieldLegend>
                    Colors
                </FieldLegend>

                <FieldDescription>
                    Pick colors for each part of the wallpaper
                </FieldDescription>
                <FieldGroup className={'space-y-2'}>
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
                                    <FieldError errors={[ fieldState.error ]} />
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
                                    <FieldError errors={[ fieldState.error ]} />
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
                                    <FieldError errors={[ fieldState.error ]} />
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
                                    Show Stats
                                </FieldLabel>
                                <Checkbox
                                    id={field.name}
                                    name={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[ fieldState.error ]} />
                                )}
                            </Field>
                        )}
                    />

                    {/* Stats colors — only shown when showPercentage is on */}
                    {values.showPercentage && (
                        <>
                            <Controller
                                name="daysLeftColor"
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
                                            <FieldError errors={[ fieldState.error ]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="percentColor"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field
                                        orientation="horizontal"
                                        data-invalid={fieldState.invalid}
                                    >
                                        <FieldLabel htmlFor={field.name}>
                                            Percentage Color
                                        </FieldLabel>
                                        <input
                                            {...field}
                                            id={field.name}
                                            type="color"
                                            className="h-8 w-14 cursor-pointer rounded border p-0.5"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[ fieldState.error ]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </>
                    )}

                </FieldGroup>
            </FieldSet>
        </form >
    );
}
