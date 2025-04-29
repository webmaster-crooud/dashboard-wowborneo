"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSetAtom } from "jotai";
import { HeaderAdmin } from "~/components/Header";
import { Breadcrumb } from "~/components/ui/Breadcrumb";
import { LoaderForm } from "~/components/ui/Form/Loader.form";
import { InputForm } from "~/components/ui/Form/Input.form";
import { SelectForm, SelectDataInterface } from "~/components/ui/Form/Select.form";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";
import { errorAtom } from "~/stores";
import { ApiSuccessResponse } from "~/types";
import { SearchTable } from "~/components/ui/Sarch.table";
import { DISCOUNT_TYPE, IPromotionRequest, IPromotionResponse } from "~/types/promotion";
import { formatDateOnly } from "~/lib/moment";
import { formatCurrency } from "~/utils/main";

const dataBreadcrumb: Breadcrumb[] = [
    { title: "Dashboard", url: "/admin" },
    { title: "Promotions", url: "/admin/promotion" },
];

export default function PromotionListPage() {
    const { promotions, loading, createPromo, updatePromo, deletePromo } = usePromotions();

    const [search, setSearch] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [editingId, setEditingId] = useState<string>("");

    const filtered = useMemo(
        () => promotions.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase())),
        [promotions, search]
    );

    if (loading.fetch) {
        return <LoaderForm loading={{ stack: "fetch", field: "promotions" }} />;
    }

    console.table(promotions);
    return (
        <>
            <HeaderAdmin dataBreadcrumb={dataBreadcrumb} />
            <section className="p-5 space-y-4 min-h-screen">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Promotions</h2>
                    <div className="flex gap-2 w-full justify-end">
                        <SearchTable search={search} setSearch={setSearch} />
                        <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                            Add Promotion
                        </button>
                    </div>
                </div>

                <PromotionTable
                    promotions={filtered}
                    onEdit={setEditingId}
                    onDelete={async (id) => {
                        if (confirm("Are you sure you want to delete this promotion?")) {
                            await deletePromo(id);
                        }
                    }}
                />
            </section>
            {showCreate && (
                <PromotionModal
                    loading={loading.action}
                    onCreate={async (data) => {
                        await createPromo(data);
                        setShowCreate(false);
                    }}
                    onClose={() => setShowCreate(false)}
                />
            )}

            {editingId && (
                <UpdatePromotionModal
                    id={editingId}
                    data={promotions.find((p) => p.id.toString() === editingId)!}
                    loading={loading.action}
                    onUpdate={async (id, data) => {
                        await updatePromo(id, data);
                        setEditingId("");
                    }}
                    onClose={() => setEditingId("")}
                />
            )}
        </>
    );
}

function usePromotions() {
    const setError = useSetAtom(errorAtom);
    const [promotions, setPromotions] = useState<IPromotionResponse[]>([]);
    const [loading, setLoading] = useState({ fetch: false, action: false });

    const fetchPromotions = useCallback(async () => {
        setLoading((l) => ({ ...l, fetch: true }));
        try {
            const { data } = await api.get<ApiSuccessResponse<IPromotionResponse[]>>("/admin/promotion", { withCredentials: true });
            setPromotions(data.data);
        } catch (err) {
            fetchError(err, setError);
        } finally {
            setLoading((l) => ({ ...l, fetch: false }));
        }
    }, [setError]);

    const createPromo = useCallback(
        async (promo: IPromotionRequest) => {
            setLoading((l) => ({ ...l, action: true }));
            try {
                await api.post<ApiSuccessResponse<IPromotionResponse>>("/admin/promotion", promo, { withCredentials: true });
                await fetchPromotions();
            } catch (err) {
                fetchError(err, setError);
            } finally {
                setLoading((l) => ({ ...l, action: false }));
            }
        },
        [fetchPromotions, setError]
    );

    const updatePromo = useCallback(
        async (id: string, promo: IPromotionRequest) => {
            setLoading((l) => ({ ...l, action: true }));
            try {
                await api.put<ApiSuccessResponse<IPromotionResponse>>(`/admin/promotion/${id}`, promo, { withCredentials: true });
                await fetchPromotions();
            } catch (err) {
                fetchError(err, setError);
            } finally {
                setLoading((l) => ({ ...l, action: false }));
            }
        },
        [fetchPromotions, setError]
    );

    const deletePromo = useCallback(
        async (id: string) => {
            setLoading((l) => ({ ...l, action: true }));
            try {
                await api.delete<ApiSuccessResponse<null>>(`/admin/promotion/${id}`, { withCredentials: true });
                await fetchPromotions();
            } catch (err) {
                fetchError(err, setError);
            } finally {
                setLoading((l) => ({ ...l, action: false }));
            }
        },
        [fetchPromotions, setError]
    );

    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    return { promotions, loading, createPromo, updatePromo, deletePromo };
}

interface PromotionTableProps {
    promotions: IPromotionResponse[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}
function PromotionTable({ promotions, onEdit, onDelete }: PromotionTableProps) {
    return (
        <div className="rounded-md border border-gray-300 shadow-sm overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
                {/* Table Head */}
                <thead>
                    <tr className="border-b border-gray-300 bg-gray-50 uppercase text-sm">
                        <th className="px-4 py-2 font-bold">Name</th>
                        <th className="px-4 py-2 font-bold">Code</th>
                        <th className="px-4 py-2 font-bold">Value</th>
                        <th className="px-4 py-2 font-bold">Start</th>
                        <th className="px-4 py-2 font-bold">End</th>
                        <th className="px-4 py-2 font-bold">Status</th>
                        <th className="px-4 py-2 font-bold">Actions</th>
                    </tr>
                </thead>
                {/* Table Body */}
                <tbody>
                    {promotions.length === 0 ? (
                        <tr className="border-b border-gray-200">
                            <td className="px-4 py-3 text-center font-bold text-gray-600" colSpan={8}>
                                No promotions available.
                            </td>
                        </tr>
                    ) : (
                        promotions.map((p) => (
                            <tr className="border-b border-gray-200" key={p.id}>
                                <td className="px-4 py-3 text-nowrap">{p.name}</td>
                                <td className="px-4 py-3 text-nowrap">{p.code}</td>
                                <td className="px-4 py-3 text-nowrap">
                                    {p.discountValue === "CURRENCY" ? formatCurrency(p.discountValue) : `${p.discountValue}%`}
                                </td>
                                <td className="px-4 py-3 text-nowrap">{formatDateOnly(p.startDate)}</td>
                                <td className="px-4 py-3 text-nowrap">{formatDateOnly(p.endDate)}</td>
                                <td className="px-4 py-3 text-nowrap">{p.status}</td>
                                <td className="px-4 py-3 text-nowrap">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onEdit(p.id.toString())}
                                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(p.id.toString())}
                                            className="px-3 py-1 text-xs bg-red-600 text-white rounded-md"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
                {/* Table Footer */}
                <tfoot className="bg-gray-200">
                    <tr>
                        <td colSpan={8} className="px-4 py-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                    Showing 1-{promotions.length} of {promotions.length}
                                </span>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md" disabled>
                                        &laquo; Previous
                                    </button>
                                    <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md" disabled>
                                        Next &raquo;
                                    </button>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

interface PromotionModalProps {
    loading: boolean;
    onCreate: (promo: IPromotionRequest) => Promise<void>;
    onClose: () => void;
}
function PromotionModal({ loading, onCreate, onClose }: PromotionModalProps) {
    const selectTypes: SelectDataInterface[] = [
        { name: "Percent", value: "PERCENT" },
        { name: "Currency", value: "CURRENCY" },
    ];
    const [form, setForm] = useState<IPromotionRequest>({
        name: "",
        code: "",
        discountType: "PERCENT",
        discountValue: "",
        startDate: "",
        endDate: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate(form);
    };

    return (
        <div className="fixed z-50 pt-20 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">Add Promotion</h3>
                <form onSubmit={submit} className="space-y-4">
                    <InputForm
                        title="Name"
                        type="text"
                        value={form.name}
                        handleInputChange={(e) => setForm({ ...form, name: e.target.value })}
                        isRequired
                    />
                    <InputForm
                        title="Code"
                        type="text"
                        value={form.code}
                        handleInputChange={(e) => setForm({ ...form, code: e.target.value })}
                        isRequired
                    />
                    <SelectForm
                        label="discountType"
                        title="Discount Type"
                        value={form.discountType}
                        onChange={(e) => setForm({ ...form, discountType: e.target.value as DISCOUNT_TYPE })}
                        data={selectTypes}
                    />
                    <InputForm
                        title="Value"
                        type={form.discountType === "CURRENCY" ? "currency" : "number"}
                        value={form.discountValue}
                        handleInputChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                        isRequired
                    />
                    <div className="flex w-full items-center justify-center gap-5">
                        <div className="w-full">
                            <label htmlFor="startDate" className="font-bold mb-2 flex items-center gap-1 text-xs uppercase">
                                Start Date
                            </label>
                            <input
                                id="startDate"
                                type="date"
                                value={form.startDate && new Date(form.startDate).toISOString().slice(0, 10)}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        // langsung simpan sebagai ISO string atau Date object
                                        startDate: e.target.value,
                                    })
                                }
                                className="border bg-gray-100 outline-brown/60 border-black rounded-lg w-full text-black py-3 px-4 text-sm"
                                required
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="endDate" className="font-bold mb-2 flex items-center gap-1 text-xs uppercase">
                                End Date
                            </label>
                            <input
                                id="endDate"
                                type="date"
                                value={form.endDate && new Date(form.endDate).toISOString().slice(0, 10)}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        endDate: e.target.value,
                                    })
                                }
                                className="border bg-gray-100 outline-brown/60 border-black rounded-lg w-full text-black py-3 px-4 text-sm"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

interface UpdatePromotionModalProps {
    id: string;
    data: IPromotionResponse;
    loading: boolean;
    onUpdate: (id: string, promo: IPromotionRequest) => Promise<void>;
    onClose: () => void;
}
function UpdatePromotionModal({ id, data, loading, onUpdate, onClose }: UpdatePromotionModalProps) {
    const selectTypes: SelectDataInterface[] = [
        { name: "Percent", value: "PERCENT" },
        { name: "Currency", value: "CURRENCY" },
    ];
    const [form, setForm] = useState<IPromotionRequest>({
        name: data.name,
        code: data.code,
        discountType: data.discountType,
        discountValue: data.discountValue.toString(),
        startDate: new Date(data.startDate).toISOString().slice(0, 10),
        endDate: new Date(data.endDate).toISOString().slice(0, 10),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(id, form);
    };

    return (
        <div className="fixed z-50 pt-20 top-0 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">Update Promotion</h3>
                <form onSubmit={submit} className="space-y-4">
                    <InputForm
                        title="Name"
                        type="text"
                        value={form.name}
                        handleInputChange={(e) => setForm({ ...form, name: e.target.value })}
                        isRequired
                    />
                    <SelectForm
                        label="discountType"
                        title="Discount Type"
                        value={form.discountType}
                        onChange={(e) => setForm({ ...form, discountType: e.target.value as DISCOUNT_TYPE })}
                        data={selectTypes}
                    />
                    <InputForm
                        title="Value"
                        type={form.discountType === "CURRENCY" ? "currency" : "number"}
                        value={form.discountValue}
                        handleInputChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                        isRequired
                    />

                    <div className="flex items-center justify-center gap-5 w-full">
                        <div className="w-full">
                            <label htmlFor="startDate" className="font-bold mb-2 flex items-center gap-1 text-xs uppercase">
                                Start Date
                            </label>
                            <input
                                id="startDate"
                                type="date"
                                value={typeof form.startDate === "string" ? form.startDate : new Date(form.startDate).toISOString().slice(0, 10)}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        startDate: e.target.value,
                                    })
                                }
                                className="border bg-gray-100 outline-brown/60 border-black rounded-lg w-full text-black py-3 px-4 text-sm"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="endDate" className="font-bold mb-2 flex items-center gap-1 text-xs uppercase">
                                End Date
                            </label>
                            <input
                                id="endDate"
                                type="date"
                                value={typeof form.endDate === "string" ? form.endDate : new Date(form.endDate).toISOString().slice(0, 10)}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        endDate: e.target.value,
                                    })
                                }
                                className="border bg-gray-100 outline-brown/60 border-black rounded-lg w-full text-black py-3 px-4 text-sm"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">
                            {loading ? "Updating..." : "Update"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
