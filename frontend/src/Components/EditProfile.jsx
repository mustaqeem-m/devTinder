// EditProfile.jsx — refreshed UI (modern, compact, single-column on mobile / two-column on desktop)
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/slice/UserSlice';
import axios from 'axios';
import { BASE_URL } from './../utils/constants';
import UserCard from './UserCard';

axios.defaults.withCredentials = true;

export default function EditProfile({ user = {} }) {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    age: user.age ?? '',
    gender: user.gender ?? '',
    about: user.about ?? '',
    profile: user.profile ?? '',
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [imgError, setImgError] = useState(false);

  // keep local state in sync if parent user changes
  useEffect(() => {
    setForm({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      age: user.age ?? '',
      gender: user.gender ?? '',
      about: user.about ?? '',
      profile: user.profile ?? '',
    });
    setImgError(false);
  }, [user]);

  const isDirty = useMemo(() => {
    return (
      (form.firstName ?? '') !== (user.firstName ?? '') ||
      (form.lastName ?? '') !== (user.lastName ?? '') ||
      String(form.age ?? '') !== String(user.age ?? '') ||
      (form.gender ?? '') !== (user.gender ?? '') ||
      (form.about ?? '') !== (user.about ?? '') ||
      (form.profile ?? '') !== (user.profile ?? '')
    );
  }, [form, user]);

  const handleChange = (key) => (e) => {
    const value = e?.target?.value;
    setForm((s) => ({ ...s, [key]: value }));
    if (key === 'profile') setImgError(false);
    setError('');
  };

  const validate = () => {
    if (!form.firstName.trim()) return 'First name required';
    if (!form.lastName.trim()) return 'Last name required';
    if (form.age !== '' && (Number(form.age) <= 0 || Number(form.age) > 120))
      return 'Age invalid';
    if (form.profile && !/^https?:\/\//i.test(form.profile))
      return 'Photo must be a valid URL (http/https)';
    return '';
  };

  const saveProfile = async (e) => {
    e?.preventDefault();
    setError('');
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        age: form.age === '' ? null : Number(form.age),
        gender: form.gender || null,
        about: form.about ?? '',
        profile: form.profile ?? '',
      };
      const res = await axios.patch(`${BASE_URL}/profile/edit`, payload, {
        withCredentials: true,
      });
      const updated = res?.data?.data ?? res?.data ?? res;
      dispatch(addUser(updated));
      setToast('Profile saved');
      setTimeout(() => setToast(''), 2600);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.Error ||
        err?.response?.data?.message ||
        err?.message ||
        'Save failed';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const revert = () => {
    setForm({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      age: user.age ?? '',
      gender: user.gender ?? '',
      about: user.about ?? '',
      profile: user.profile ?? '',
    });
    setError('');
    setImgError(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: form card */}
        <form
          onSubmit={saveProfile}
          className="bg-gradient-to-b from-slate-900/70 to-slate-900/50 border border-white/6 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Edit profile
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Update your public profile — changes are visible to other devs.
              </p>
            </div>
            <div className="text-right">
              <button
                type="button"
                onClick={revert}
                className="text-xs px-3 py-1 rounded bg-slate-800/60 text-slate-200 hover:bg-slate-800"
              >
                Revert
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col">
              <span className="text-xs text-slate-300 mb-1">First name</span>
              <input
                value={form.firstName}
                onChange={handleChange('firstName')}
                className="input bg-white/3 text-white placeholder-white/40"
                placeholder="First"
                required
              />
            </label>

            <label className="flex flex-col">
              <span className="text-xs text-slate-300 mb-1">Last name</span>
              <input
                value={form.lastName}
                onChange={handleChange('lastName')}
                className="input bg-white/3 text-white placeholder-white/40"
                placeholder="Last"
                required
              />
            </label>

            <label className="flex flex-col">
              <span className="text-xs text-slate-300 mb-1">Age</span>
              <input
                type="number"
                min="1"
                max="120"
                value={form.age}
                onChange={handleChange('age')}
                className="input bg-white/3 text-white"
                placeholder="e.g. 25"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-xs text-slate-300 mb-1">Gender</span>
              <select
                value={form.gender ?? ''}
                onChange={handleChange('gender')}
                className="select bg-white/3 text-white"
              >
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </label>
          </div>

          <div className="mt-4">
            <label className="flex flex-col">
              <span className="text-xs text-slate-300 mb-1">Photo URL</span>
              <input
                value={form.profile}
                onChange={handleChange('profile')}
                className="input bg-white/3 text-white"
                placeholder="https://..."
              />
              <div className="text-xs text-slate-400 mt-1">
                Paste a direct image URL. Leave empty to remove photo.
              </div>
            </label>
          </div>

          <div className="mt-4">
            <label className="flex flex-col">
              <span className="text-xs text-slate-300 mb-1">About</span>
              <textarea
                value={form.about}
                onChange={handleChange('about')}
                className="textarea bg-white/3 text-white h-28"
                placeholder="Short bio — what do you build?"
              />
            </label>
          </div>

          {error && <div className="mt-3 text-rose-400 text-sm">{error}</div>}

          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={!isDirty || saving}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                !isDirty || saving
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-500 text-white hover:brightness-95'
              }`}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>

            <button
              type="button"
              onClick={() => {
                setForm({ ...form, profile: '' });
                setImgError(false);
              }}
              className="px-3 py-2 rounded-full bg-slate-800 text-sm text-slate-200 hover:bg-slate-700"
            >
              Clear photo
            </button>

            <div className="ml-auto text-xs text-slate-400">
              Changes saved to your account
            </div>
          </div>
        </form>

        {/* Right: preview + quick actions */}
        <aside className="space-y-4">
          <div className="bg-gradient-to-b from-slate-900/60 to-slate-900/40 border border-white/6 rounded-2xl p-4 shadow-lg w-[360px]">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-700 flex items-center justify-center border border-white/8">
                {form.profile && !imgError ? (
                  <img
                    src={form.profile}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="text-sm text-slate-400">No image</div>
                )}
              </div>

              <div>
                <div className="text-lg font-semibold text-white">
                  {form.firstName || 'First'} {form.lastName || 'Last'}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {form.age
                    ? `${form.age} • ${form.gender ?? ''}`
                    : form.gender ?? ''}
                </div>
              </div>
            </div>

            <div className="mt-3 text-sm text-slate-300 line-clamp-3">
              {form.about || 'No bio yet — tell people what you build.'}
            </div>

            <div className="mt-4 flex gap-2">
              <a
                href={form.profile || '#'}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => {
                  if (!form.profile) e.preventDefault();
                }}
                className="text-xs text-blue-300 underline"
              >
                Open photo
              </a>
              <button
                onClick={() =>
                  setForm((s) => ({
                    ...s,
                    profile:
                      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
                  }))
                }
                className="text-xs text-slate-300"
              >
                Use a sample photo
              </button>
            </div>
          </div>

          {/* Live card preview (bigger) */}
          <div className="w-[360px]">
            <UserCard user={form} />
          </div>
        </aside>
      </div>

      {/* toast */}
      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50">
          <div className="bg-emerald-500 text-white px-4 py-2 rounded-md shadow-lg">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
