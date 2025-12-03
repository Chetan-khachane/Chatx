import React, { useEffect, useRef, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { auth, db, storage } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import {
  setDoc,
  doc,
  getDoc,
  serverTimestamp,
  addDoc,
  count,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

//username availability
//notifier
export default function Register() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [preview, setPreview] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [isUsernameChecked, setIsUsernameChecked] = useState(false);
  const [isEmailUsed, setIsEmailUsed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [phoneAvailable,setPhoneAvailable] = useState(true)
  const [phone,setPhone] = useState(null)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [didMount, setDidMount] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    dob: false,
    email: false,
    username: false,
    password: false,
    confirmPassword: false,
    profilePicture: false,
    phone : false
  });
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();

  const removeCountryCode = (phone) => {
      return phone.replace(/^\+\d{1,3}/, "");
  };

  const hasNonNumeric = (phone) => {
      return /\D/.test(phone);
    };

    const processPhone = (input) => {
      const withoutCode = removeCountryCode(input);
      const containsInvalid = hasNonNumeric(withoutCode);

      return {
        phone: withoutCode,
        hasNonNumeric: containsInvalid
      };
   };



  async function checkUserNameAvailablility(username) {
    const ref = doc(db, "usernameUsed", username);
    const snap = await getDoc(ref);
    return !snap.exists();
  }

  async function checkPhoneAvailablility(phone) {
    const ref = doc(db, "usernames",phone);
    const snap = await getDoc(ref);
    setPhoneAvailable(!snap.exists())
  }

  useEffect(() => {
    const newErrors = {};
    if (!didMount) {
      setDidMount(true);
      return;
    }
    //name
    if (touched.name) {
      if (!name.trim()) newErrors.name = "Full name required";
      else if (name.trim().length < 2)
        newErrors.name = "Name must atleast 2 characters";
    }

    if(touched.phone){
      const processedPhone = processPhone(phone.trim())
      if(!phone.trim()) newErrors.phone = "Phone no is required"
      else if(processedPhone.hasNonNumeric) newErrors.phone = "Phone field should contain only numeric values"
      else if(phone.trim().length < 10 || phone.trim().length > 11) newErrors.phone = "Enter a valid phone no"
      if(phone.trim())
        checkPhoneAvailablility(phone)
     
    }

    //dob
    if (touched.dob) {
      if (!dob) newErrors.dob = "Date of Birth is Required";
      else {
        const today = new Date();
        const userDob = new Date(dob);
        if (userDob > today) newErrors.dob = "Date cannot be future date";
        else {
          const age = today.getFullYear() - userDob.getFullYear();
          if (age < 14) newErrors.dob = "You must be minimum 14 years old";
        }
      }
    }

    //eamil
    if (touched.email) {
      if (!email.trim()) newErrors.email = "Email is required.";
    }

    //username
    if (touched.username) {
      if (!username.trim()) newErrors.username = "Username is Required.";
      else if (!/^[a-zA-Z0-9_]+$/.test(username))
        newErrors.username =
          "Username can only have letters, numbers, or underscores.";
      else if (username.length < 3 || username.length > 15) {
        newErrors.username = "Username must be 3-15 characters.";
      }
    }
    //password
    if (touched.password) {
      if (!password) newErrors.password = "Password is required.";
      else if (password.length < 6)
        newErrors.password = "Password must be at least 6 characters.";
      else if (!/[A-Z]/.test(password))
        newErrors.password = "Must contain at least 1 uppercase letter.";
      else if (!/[a-z]/.test(password))
        newErrors.password = "Must contain at least 1 lowercase letter.";
      else if (!/[0-9]/.test(password))
        newErrors.password = "Must contain at least 1 number.";
    }
    //Confirm Password
    if (touched.confirmPassword) {
      if (confirmPassword !== password)
        newErrors.confirmPassword = "Passwords must match";

      if (profilePicture) {
        if (profilePicture.size > 2 * 1024 * 1024)
          newErrors.profilePicture = "Image must be under 2MB.";
        else if (!profilePicture.type.startsWith("image/"))
          newErrors.profilePicture = "File must be an image.";
      }
    }

    setValidationErrors(newErrors);
  }, [name, dob, email, username, password,phone, confirmPassword, profilePicture]);

  useEffect(() => {
    if (verificationSent) {
      navigate("/verifyEmail", {
        replace: true,
        state: {
          email,
          resendCooldownTimer: 300,
          verificationSent,
        },
      });
    }
  }, [verificationSent]);

  const handleSubmit = async (e) => {
    let profileUrl = "";
    e.preventDefault();

    if (!usernameAvailable && !phoneAvailable) {
      return;
    }
    if (Object.keys(validationErrors).length > 0) return;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const uid = userCredential.user.uid;
      await sendEmailVerification(userCredential.user);
      setVerificationSent(true);

      if (profilePicture) {
        const storageRef = ref(storage, `profileImages/${uid}`);
        await uploadBytes(storageRef, profilePicture);
        profileUrl = await getDownloadURL(storageRef);
        await userCredential.user.getIdToken(true);
      }
      await setDoc(doc(db, "Users", uid), {
        name,
        username,
        dob,
        profileUrl: !profilePicture ? "" : profileUrl,
        Notification_settings : {
            Messages : true,
            Reactions : true,
            Message_Recieved  : true
        },
        FreindList : [],
        alert_selected : "",
        Notification_tune  : "",
        phone,
        createdAt: serverTimestamp(),
      });
      await setDoc(doc(db, "usernames",phone), {
        uid,
        name,
        profileUrl,
      });
      await setDoc(doc(db,"usernameUsed",username),{uid})
      //show successful verification message when user verify its email
      //when login,if not email verified then show that please verify
    } catch (e) {
      if (e.code == "auth/email-already-in-use") {
        setIsEmailUsed(true);
      }
      console.error(e);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f2f7f5] p-4 sm:p-8">
      <div className="flex flex-col bg-[#fdfffe] shadow-xl shadow-black/25 rounded-sm w-full sm:w-[80%] md:w-[60%] lg:w-[45%] xl:w-[35%] p-6 sm:p-10">
        <h2 className="text-3xl sm:text-4xl font-semibold text-[#00214d] text-center mb-6">
          Sign Up
        </h2>

        <form
          className="flex flex-col gap-3 sm:gap-4"
          onSubmit={(e) => handleSubmit(e)}
        >
          {/* Name */}
          <label htmlFor="name" className="text-[#2E294E] text-base sm:text-lg">
            Enter your Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setTouched((prev) => ({ ...prev, name: true }));
            }}
            className="outline-none rounded-xl p-2 bg-[#f2f7f5] text-[#D90368] font-medium"
          />
          {touched.name && validationErrors.name && (
            <p className="text-red-500 text-sm">{validationErrors.name}</p>
          )}

          {/* DOB */}
          <label htmlFor="dob" className="text-[#2E294E] text-base sm:text-lg">
            Enter your DOB
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => {
              setDob(e.target.value);
              setTouched((prev) => ({ ...prev, dob: true }));
            }}
            className="outline-none rounded-xl p-2 bg-[#f2f7f5] text-[#D90368]"
          />
          {touched.password && validationErrors.dob && (
            <p className="text-red-500 text-sm">{validationErrors.dob}</p>
          )}

          {/* Email */}
          <label
            htmlFor="email"
            className="text-[#2E294E] text-base sm:text-lg"
          >
            Enter your Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setTouched((prev) => ({ ...prev, email: true }));
            }}
            className="outline-none rounded-xl p-2 bg-[#f2f7f5] text-[#D90368]"
          />
          {touched.email && validationErrors.email && (
            <p className="text-red-500 text-sm">{validationErrors.email}</p>
          )}
          {isEmailUsed ? (
            <p className="text-red-500 text-sm">Email Already in Use</p>
          ) : (
            ""
          )}
          {/* Phone no */}
          <label
            htmlFor="phone"
            className="text-[#2E294E] text-base sm:text-lg"
          >
            Enter your Phone no.
          </label>
          <input
            type="tel"
            onChange={(e) => {
              setPhone(e.target.value);
              setTouched((prev) => ({ ...prev, phone: true }));
            }}
            className="outline-none rounded-xl p-2 bg-[#f2f7f5] text-[#D90368]"
          />
          {touched.phone && validationErrors.phone && (
            <p className="text-red-500 text-sm">{validationErrors.phone}</p>
          )}{
                 phoneAvailable ? "" : <p className="text-red-500 text-sm">Phone No not available</p>
          }
          {/* Username */}
          <label
            htmlFor="username"
            className="text-[#2E294E] text-base sm:text-lg"
          >
            Create Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setIsUsernameChecked(false);
              setTouched((prev) => ({ ...prev, username: true }));
            }}
            onBlur={(e) => {
              if (username)
                checkUserNameAvailablility(username).then((val) => {
                  setIsUsernameChecked(true);
                  setUsernameAvailable(val);
                });
            }}
            className="outline-none rounded-xl p-2 bg-[#f2f7f5] text-[#D90368]"
          />
          {touched.username && validationErrors.username && (
            <p className="text-red-500 text-sm">{validationErrors.username}</p>
          )}
          {!username ? (
            ""
          ) : usernameAvailable ? (
            <p className="text-emerald-500 text-sm">Username Available</p>
          ) : isUsernameChecked ? (
            <p className="text-red-500 text-sm">Username not Available</p>
          ) : (
            ""
          )}
          {/* Password */}
          <label
            htmlFor="createpassword"
            className="text-[#2E294E] text-base sm:text-lg"
          >
            Create Password
          </label>
          <div className="relative w-full">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              onChange={(e) => {
                setPassword(e.target.value);
                setTouched((prev) => ({ ...prev, password: true }));
              }}
              className="outline-none w-full rounded-xl p-2 bg-[#f2f7f5] text-[#D90368]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-2 right-4 p-1 cursor-pointer"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M1 1l22 22" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {touched.password && validationErrors.password && (
            <p className="text-red-500 text-sm">{validationErrors.password}</p>
          )}

          {/* Confirm Password */}
          <label
            htmlFor="confirmpassword"
            className="text-[#2E294E] text-base sm:text-lg"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setTouched((prev) => ({ ...prev, confirmPassword: true }));
              }}
              className="outline-none w-full rounded-xl p-2 bg-[#f2f7f5] text-[#D90368]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute top-2 right-4 p-1 cursor-pointer"
            >
              {showConfirmPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M1 1l22 22" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {touched.confirmPassword && validationErrors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {validationErrors.confirmPassword}
            </p>
          )}

          {/* Profile Picture */}
          <label
            htmlFor="profilepic"
            className="text-[#272343] text-base sm:text-lg"
          >
            Upload a Profile Picture
          </label>
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-5">
            <input
              type="file"
              id="profilepic"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setProfilePicture(file);
                setPreview(URL.createObjectURL(file));
                setTouched((prev) => ({ ...prev, profilePicture: true }));
              }}
              className="p-2 border rounded-xs cursor-pointer outline-none border-none w-full sm:w-[60%] bg-[#ffd803]"
            />
            {preview && (
              <img
                src={preview}
                alt="Profile Preview"
                className="w-25 h-25  rounded-full border-none object-cover shadow-black shadow-md/30"
              />
            )}
          </div>
          {touched.profilePicture && validationErrors.profilePicture && (
            <p className="text-red-500 text-sm">
              {validationErrors.profilePicture}
            </p>
          )}
          <p className="text-[12px] text-blue-500">
            Profile Picture is not mandatory
          </p>
          {/* Submit Button */}
          <button
            className="mt-6 p-3 bg-[#00ebc7] rounded-md text-lg sm:text-xl text-[#00214d] 
                       shadow-lg shadow-blue-500/30 hover:-translate-y-1 hover:scale-105 cursor-pointer
                       transition-all font-medium"
            type="submit"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4 text-sm sm:text-base">
          Registered already?{" "}
          <NavLink to={"/"} className="text-[#D90368] hover:text-[#3454D1]">
            Click here
          </NavLink>
        </p>
      </div>
    </div>
  );
}
