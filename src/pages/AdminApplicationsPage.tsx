/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { organizerApi } from "../api/organizer";
import type { OrganizerApplication } from "../types";
import { getErrorMessage } from "../lib/httpError";

export function AdminApplicationsPage() {
  const [applications, setApplications] = useState<OrganizerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadApplications = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await organizerApi.listApplications("PENDING");
      setApplications(data.applications);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load applications"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadApplications();
  }, []);

  const approve = async (id: string) => {
    setProcessingId(id);

    try {
      await organizerApi.approve(id);

      setApplications((prev) =>
        prev.filter((application) => application.id !== id)
      );
    } catch (err) {
      alert(getErrorMessage(err, "Approve failed"));
    } finally {
      setProcessingId(null);
    }
  };

  const reject = async (id: string) => {
    setProcessingId(id);

    try {
      await organizerApi.reject(id);

      setApplications((prev) =>
        prev.filter((application) => application.id !== id)
      );
    } catch (err) {
      alert(getErrorMessage(err, "Reject failed"));
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F4EE]">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-[#D8B58A] border-t-[#8C5A2B]" />
          <p className="mt-5 text-lg font-semibold text-[#6B4E35]">
            Loading applications...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4EE]">

      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* Header */}

        <div className="rounded-3xl bg-gradient-to-r from-[#A67C52] via-[#B98B5F] to-[#E3C8A8] p-10 text-white shadow-xl">

          <h1 className="text-5xl font-black">
            Organizer Applications
          </h1>

          <p className="mt-4 text-lg text-[#FFF8F0]">
            Review organizer requests and approve trusted event creators.
          </p>

        </div>

        {/* Stats */}

        <div className="mt-8">

          <div className="inline-flex rounded-2xl bg-white px-6 py-4 shadow-lg">

            <div>

              <div className="text-3xl font-black text-[#8C5A2B]">
                {applications.length}
              </div>

              <div className="text-[#6B5A4D]">
                Pending Applications
              </div>

            </div>

          </div>

        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-600">
            {error}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-white p-16 text-center shadow-xl">

            <div className="text-7xl">
              🎉
            </div>

            <h2 className="mt-6 text-3xl font-bold text-[#3E3025]">
              Everything is up to date
            </h2>

            <p className="mt-3 text-[#7A6757]">
              There are no pending organizer applications.
            </p>

          </div>
        ) : (

          <div className="mt-10 grid gap-8">

            {applications.map((app) => (

              <div
                key={app.id}
                className="
                  rounded-3xl
                  bg-white
                  p-8
                  shadow-lg
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-2xl
                "
              >

                <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">

                  <div className="flex-1">

                    <div className="flex items-center gap-4">

                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8C5A2B] text-2xl text-white">
                        👤
                      </div>

                      <div>

                        <h2 className="text-2xl font-bold text-[#3E3025]">
                          {app.user?.name}
                        </h2>

                        <p className="text-[#7A6757]">
                          {app.user?.email}
                        </p>

                      </div>

                    </div>

                    <div className="mt-8">

                      <h3 className="font-bold text-[#5D4635]">
                        Motivation
                      </h3>

                      <p className="mt-3 whitespace-pre-wrap rounded-2xl bg-[#FCFAF8] p-5 leading-8 text-[#6B5A4D]">
                        {app.message || "No message provided."}
                      </p>

                    </div>

                  </div>

                  <div className="w-full lg:w-72">

                    <div className="rounded-2xl bg-[#F7EFE7] p-5">

                      <div className="text-sm text-[#7A6757]">
                        Current Status
                      </div>

                      <div className="mt-2 inline-flex rounded-full bg-yellow-100 px-4 py-2 font-bold text-yellow-700">
                        {app.status}
                      </div>

                    </div>

                    <div className="mt-6 space-y-4">

                      <button
                        disabled={processingId === app.id}
                        onClick={() => approve(app.id)}
                        className="
                          w-full
                          rounded-xl
                          bg-green-600
                          py-3
                          font-bold
                          text-white
                          transition
                          hover:bg-green-700
                          disabled:opacity-50
                        "
                      >
                        {processingId === app.id
                          ? "Processing..."
                          : "Approve"}
                      </button>

                      <button
                        disabled={processingId === app.id}
                        onClick={() => reject(app.id)}
                        className="
                          w-full
                          rounded-xl
                          bg-red-600
                          py-3
                          font-bold
                          text-white
                          transition
                          hover:bg-red-700
                          disabled:opacity-50
                        "
                      >
                        Reject
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}